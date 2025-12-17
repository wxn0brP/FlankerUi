import type { fetchVQL as fetchVQLType } from "@wxn0brp/vql-client";
import type { MountView, MountViewComponent, TemplateDataMode, ViewOptions } from "./types";

let fetchVQL: typeof fetchVQLType = (window as any)?.VQLClient?.fetchVQL;
export function setFetchVQL(fn: typeof fetchVQLType) { fetchVQL = fn; }

export function mountView<Extra extends Record<string, any> = {}>(
    opts: ViewOptions,
    extra?: Extra
): MountView<Extra> {
    const el = typeof opts.selector === "string" ? document.querySelector(opts.selector) as HTMLElement : opts.selector;
    if (!el) throw new Error(`mountView: selector '${opts.selector}' not found`);

    async function load(args: { [key: string]: any } = {}) {
        let data: any;
        const assignArgs = Object.assign({}, opts.queryArgs, args);

        if (opts.queryFunction)
            data = await opts.queryFunction(assignArgs);

        else if (typeof opts.query === "string")
            data = await fetchVQL({ query: opts.query, var: args });

        else if (typeof opts.query === "function")
            data = await fetchVQL(await opts.query(assignArgs));

        else if (typeof opts.query === "object" && !Array.isArray(opts.query))
            data = await fetchVQL(opts.query);

        else
            data = assignArgs;

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
        render(data, opts.templateDataMode ?? "replace");
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

    function render(data: any, mode: TemplateDataMode = "replace") {
        let res: string = "";
        let empty = false;

        // Check if data is empty
        if (
            (Array.isArray(data) && data.length === 0) ||
            (typeof data === "object" && data !== null && Object.keys(data).length === 0) ||
            data === null ||
            data === undefined
        ) {
            res = opts.emptyData ?? "";
            empty = true;
        } else {
            res = Array.isArray(data) ? data.map(opts.template).join("") : opts.template(data);
        }

        // Handle mode
        if (mode === "append" || mode === "prepend") {
            if (empty) {
                // If data is empty:
                // - if the element already has some content (and hasn't been marked as empty before), do nothing
                if (el.innerHTML.trim() !== "" && el.getAttribute("data-fu-empty") !== "true") {
                    return;
                }
                // Otherwise, set the fallback
                el.innerHTML = res;
                el.setAttribute("data-fu-empty", "true");
            } else {
                // Data is not empty:
                // If there was a fallback, remove it and start from a clean state
                if (el.getAttribute("data-fu-empty") === "true") {
                    el.innerHTML = res;
                } else {
                    // Otherwise, append/prepend
                    el.innerHTML = mode === "append" ? el.innerHTML + res : res + el.innerHTML;
                }
                el.removeAttribute("data-fu-empty");
            }
        } else {
            // Replace mode – always replaces
            el.innerHTML = res;
            if (empty) {
                el.setAttribute("data-fu-empty", "true");
            } else {
                el.removeAttribute("data-fu-empty");
            }
        }
    }

    const base: MountViewComponent = {
        element: el,
        mount: () => { },
        load,
        render
    };

    return Object.assign(base, extra ?? {}) as MountView<Extra>;
}

export * as uiHelpers from "./helpers";
export * as infinityScroll from "./infinityScroll";
