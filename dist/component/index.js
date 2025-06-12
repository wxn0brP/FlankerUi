export const componentVars = {
    fetchVQL: async () => ({})
};
;
export function mountView(opts) {
    const el = typeof opts.selector === "string" ? document.querySelector(opts.selector) : opts.selector;
    if (!el)
        throw new Error(`mountView: selector '${opts.selector}' not found`);
    async function load(...args) {
        let data;
        if (typeof opts.query === "string") {
            data = await componentVars.fetchVQL(opts.query, { ...args });
        }
        else if (typeof opts.query === "function") {
            const query = await opts.query(...(opts.queryArgs ?? []), ...args);
            data = await componentVars.fetchVQL(query, { ...args });
        }
        else if (opts.queryFunction) {
            data = await opts.queryFunction(...(opts.queryArgs ?? []), ...args);
        }
        else {
            throw new Error("Invalid query type");
        }
        if (opts.transform)
            data = opts.transform(data);
        if (opts.sort) {
            if (typeof opts.sort === "function") {
                data = data.sort(opts.sort);
            }
            else if (typeof opts.sort === "string") {
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
                const target = e.target;
                for (const [selector, handler] of Object.entries(targets)) {
                    const match = target.closest(selector);
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
export * as uiHelpers from "./helpers.js";
//# sourceMappingURL=index.js.map