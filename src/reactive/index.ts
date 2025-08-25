import { StoreType } from "../store";
import { ReactiveCbParams, subscribeToEntireStore } from "./walk";

export function reactFromAttr(attrVal: string, el: HTMLElement, params: ReactiveCbParams) {
    if (!attrVal) return;

    const parts = attrVal.split(",").map(p => p.trim());
    const elBaseKey = el.getAttribute("data-base-key");

    parts.forEach(part => {
        // format: path:type:attrName[:expr]
        // eg "btn.showButton:attr:disabled:v === false"
        // See docs/reactive.md
        const [relativePath, _type, attrName, ...exprArr] = part.split(":").map(s => s.trim());
        if (!relativePath) return;
        const elAccessPath = elBaseKey ? elBaseKey + "." + relativePath : relativePath;

        if (elAccessPath !== [...params.accessPath, params.key].join(".")) return;

        const val = params.newValue;
        if (val === undefined) return;

        const expr = exprArr.join(":");
        const computeValue = expr
            ? (v: any) => {
                if (expr === "!") return !v;
                try {
                    return new Function("v", `return (${expr})`)(v);
                } catch (e) {
                    console.error("Reactive expression error:", e, expr);
                    return v;
                }
            }
            : (v: any) => v;

        const result = computeValue(val);
        const type = _type || "style";
        switch (type) {
            case "attr":
                if (result === false) el.removeAttribute(attrName);
                else el.setAttribute(attrName, result);
                break;
            case "style":
                if (attrName) (el.style as any)[attrName] = result;
                break;
            case "class":
                if (result) el.classList.add(attrName);
                else el.classList.remove(attrName);
                break;
            case "textContent":
                el.textContent = result;
                break;
            case "innerHTML":
                el.innerHTML = result;
            default:
                console.warn("Unknown reactive type:", type);
                break;
        };
    });
}

export function initReactiveHTML(store: StoreType<any>, root: HTMLElement | Document = document) {
    subscribeToEntireStore(store, (params) => {
        const elements = root.querySelectorAll<HTMLElement>(`[data-r], [data-r-0], [data-r-1]`);

        elements.forEach(el => {
            const reactiveAttrs = Array.from(el.attributes)
                .filter(a => a.name.startsWith("data-r"))
                .map(a => a.value.trim());

            reactiveAttrs.forEach(attrVal => reactFromAttr(attrVal, el, params));
        });
    });
}