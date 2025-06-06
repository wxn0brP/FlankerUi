export const componentVars: {
    fetchVQL<T>(query: string, vars?: object): Promise<T | T[]>
} = {
    fetchVQL: async () => ({} as any)
}

type ViewOptions<T = any> = {
    selector: string;
    query: string | ((...args: any[]) => Promise<T>);
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
    const el = document.querySelector(opts.selector) as HTMLElement;
    if (!el) throw new Error(`mountView: selector '${opts.selector}' not found`);

    async function load(...args: any[]) {
        let data: any;
        if (typeof opts.query === "string") {
            data = await componentVars.fetchVQL(opts.query, { ...args });
        } else if (typeof opts.query === "function") {
            data = await opts.query(...(opts.queryArgs ?? []), ...args);
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


export * as uiHelpers from "./helpers";