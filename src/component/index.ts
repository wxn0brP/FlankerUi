import { fetchVQL } from "@wxn0brp/vql-client";
import { VqlQueryRaw } from "@wxn0brp/vql-client/dist/vql";
import { UiComponent } from "../types";

export type QueryFunction<T=any> = (...any: any[]) => Promise<T>;

export interface ViewOptions {
    selector: string | HTMLElement;
    query?: VqlQueryRaw | QueryFunction<VqlQueryRaw>;
    queryFunction?: QueryFunction;
    queryArgs?: { [key: string]: any };
    transform?: (data: any) => any;
    sort?: string | ((a: any, b: any) => number);
    template: (item: any) => string;
    events?: {
        [eventType: string]: {
            [selector: string]: (el: HTMLElement, e: Event) => void;
        };
    };
    onData?: (data: any) => void;
    onDataTransform?: (data: any) => any;
    onDataSort?: (data: any) => number;
};

export function mountView<Extra extends Record<string, any> = {}>(
    opts: ViewOptions,
    extra?: Extra
): UiComponent & {
    load(args?: { [key: string]: any }): Promise<void>;
    render(data: any): void;
} & Extra {
    const el = typeof opts.selector === "string" ? document.querySelector(opts.selector) as HTMLElement : opts.selector;
    if (!el) throw new Error(`mountView: selector '${opts.selector}' not found`);

    async function load(args: { [key: string]: any } = {}) {
        let data: any;
        if (opts.queryFunction) {
            data = await opts.queryFunction(Object.assign({}, opts.queryArgs, args));

        } else if (typeof opts.query === "string") {
            data = await fetchVQL({ query: opts.query, var: args });

        } else if (typeof opts.query === "function") {
            const query = await opts.query(Object.assign({}, opts.queryArgs, args));
            data = await fetchVQL(query);

        } else if (typeof opts.query === "object" && !Array.isArray(opts.query)) {
            data = await fetchVQL(opts.query);

        } else {
            throw new Error("Invalid query type");
        }

        if (opts.onData) opts.onData(data);
        if (opts.transform) data = opts.transform(data);
        if (opts.onDataTransform) opts.onDataTransform(data);

        if (opts.sort) {
            if (typeof opts.sort === "function") {
                data = data.sort(opts.sort);
            } else if (typeof opts.sort === "string") {
                const key = opts.sort;
                data = data.sort((a: any, b: any) => {
                    const av = a?.[key], bv = b?.[key];
                    return (typeof av === "string" || typeof bv === "string")
                        ? String(av).localeCompare(String(bv))
                        : (av ?? 0) - (bv ?? 0);
                });
            }
        }

        if (opts.onDataSort) opts.onDataSort(data);
        render(data);
    }

    // Events (delegated, attached once)
    if (opts.events) {
        for (const [type, targets] of Object.entries(opts.events)) {
            el.addEventListener(type, (e) => {
                const target = e.target as HTMLElement;
                for (const [selector, handler] of Object.entries(targets)) {
                    const match = target.closest(selector) as HTMLElement;
                    if (match && el.contains(match)) {
                        handler(match, e);
                        break;
                    }
                }
            });
        }
    }

    function render(data: any) {
        el.innerHTML = Array.isArray(data)
            ? data.map(opts.template).join("")
            : opts.template(data);
    }

    const base: UiComponent & {
        load: typeof load;
        render: typeof render;
    } = {
        element: el,
        mount: () => {},
        load,
        render
    };

    return Object.assign(base, extra ?? {}) as UiComponent & typeof base & Extra;
}

export type MountView = ReturnType<typeof mountView>;
export * as uiHelpers from "./helpers";