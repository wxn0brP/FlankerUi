export const componentVars: {
    fetchVQL<T>(query: string, vars?: object): Promise<T | T[]>
} = {
    fetchVQL: async () => ({} as any)
}

export type QueryStringFunction = (...any: any[]) => Promise<string>;
export type QueryFunction = <T=any>(...any: any[]) => Promise<T>;

export interface ViewOptions<T = any> {
    selector: string | HTMLElement;
    query?: string | QueryStringFunction;
    queryFunction?: QueryFunction;
    queryArgs?: any[];
    transform?: (data: T) => any;
    sort?: string | ((a: any, b: any) => number);
    template: (item: any) => string;
    events?: {
        [eventType: string]: {
            [selector: string]: (el: HTMLElement, e: Event) => void;
        };
    };
};

export function mountView(opts: ViewOptions) {
    const el = typeof opts.selector === "string" ? document.querySelector(opts.selector) as HTMLElement : opts.selector;
    if (!el) throw new Error(`mountView: selector '${opts.selector}' not found`);

    async function load(...args: any[]) {
        let data: any;
        if (typeof opts.query === "string") {
            data = await componentVars.fetchVQL(opts.query, { ...args });
        } else if (typeof opts.query === "function") {
            const query = await opts.query(...(opts.queryArgs ?? []), ...args);
            data = await componentVars.fetchVQL(query, { ...args });
        } else if (opts.queryFunction) {
            data = await opts.queryFunction(...(opts.queryArgs ?? []), ...args);
        } else {
            throw new Error("Invalid query type");
        }

        if (opts.transform) data = opts.transform(data);

        if (opts.sort) {
            if (typeof opts.sort === "function") {
                data = data.sort(opts.sort);
            } else if (typeof opts.sort === "string") {
                const key = opts.sort;
                data = data.sort((a, b) => {
                    const av = a?.[key], bv = b?.[key];
                    return (typeof av === "string" || typeof bv === "string")
                        ? String(av).localeCompare(String(bv))
                        : (av ?? 0) - (bv ?? 0);
                });
            }
        }

        el.innerHTML = Array.isArray(data)
            ? data.map(opts.template).join("")
            : opts.template(data);
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

    return {
        load,
        element: el
    };
}

export type MountView = ReturnType<typeof mountView>;
export * as uiHelpers from "./helpers";