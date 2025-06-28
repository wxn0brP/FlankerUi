import { fetchVQL } from "@wxn0brp/vql-client";
;
export function mountView(opts, extra) {
    const el = typeof opts.selector === "string" ? document.querySelector(opts.selector) : opts.selector;
    if (!el)
        throw new Error(`mountView: selector '${opts.selector}' not found`);
    async function load(args = {}) {
        let data;
        if (opts.queryFunction) {
            data = await opts.queryFunction(Object.assign({}, opts.queryArgs, args));
        }
        else if (typeof opts.query === "string") {
            data = await fetchVQL({ query: opts.query, var: args });
        }
        else if (typeof opts.query === "function") {
            const query = await opts.query(Object.assign({}, opts.queryArgs, args));
            data = await fetchVQL(query);
        }
        else if (typeof opts.query === "object" && !Array.isArray(opts.query)) {
            data = await fetchVQL(opts.query);
        }
        else {
            throw new Error("Invalid query type");
        }
        if (opts.onData)
            opts.onData(data);
        if (opts.transform)
            data = opts.transform(data);
        if (opts.onDataTransform)
            opts.onDataTransform(data);
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
        if (opts.onDataSort)
            opts.onDataSort(data);
        render(data, opts.emptyDataMode ?? "replace");
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
    function render(data, mode = "replace") {
        let res = "";
        let empty = false;
        if ((Array.isArray(data) && data.length === 0) ||
            (typeof data === "object" && Object.keys(data).length === 0) ||
            (data === null || data === undefined)) {
            res = opts.emptyData ?? "";
            empty = true;
        }
        else {
            res = Array.isArray(data) ? data.map(opts.template).join("") : opts.template(data);
        }
        if (mode === "append") {
            // if empty data and el already has content, do nothing
            if (empty && el.innerHTML)
                return;
            // else render or see opts.emptyData
            el.innerHTML += res;
        }
        else if (mode === "prepend") {
            if (empty && el.innerHTML)
                return;
            el.innerHTML = res + el.innerHTML;
        }
        else {
            el.innerHTML = res;
        }
    }
    const base = {
        element: el,
        mount: () => { },
        load,
        render
    };
    return Object.assign(base, extra ?? {});
}
export * as uiHelpers from "./helpers.js";
//# sourceMappingURL=index.js.map