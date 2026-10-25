function compileExpr(expr) {
    if (!expr)
        return (v) => v;
    if (expr === "!")
        return (v) => !v;
    try {
        return new Function("v", `return (${expr})`);
    }
    catch (e) {
        console.error("Reactive expression error:", e, expr);
        return (v) => v;
    }
}
function applyBinding(b, val) {
    if (val === undefined)
        return;
    const result = b.computeValue(val);
    switch (b.type) {
        case "attr":
            if (result === false)
                b.el.removeAttribute(b.attrName);
            else
                b.el.setAttribute(b.attrName, result);
            break;
        case "style":
            if (b.attrName)
                b.el.style[b.attrName] = result;
            break;
        case "class":
            if (result)
                b.el.classList.add(b.attrName);
            else
                b.el.classList.remove(b.attrName);
            break;
        case "textContent":
            b.el.textContent = result;
            break;
        case "innerHTML":
            b.el.innerHTML = result;
            break;
        default:
            console.warn("Unknown reactive type:", b.type);
            break;
    }
}
function subscribePath(store, path, callback) {
    let current = store;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const cell = current[key];
        if (cell && cell.isStore) {
            current = cell;
        }
        else {
            console.warn(`Reactive: path "${path.join(".")}" not found in store`);
            return;
        }
    }
    const leafKey = path[path.length - 1];
    const cell = current[leafKey];
    if (!cell || cell.isStore || typeof cell.subscribe !== "function") {
        console.warn(`Reactive: cell "${path.join(".")}" not found in store`);
        return;
    }
    cell.subscribe((val) => callback(val));
    callback(cell.get());
}
const REACTIVE_ATTRS = [
    "data-r",
    "data-r-0",
    "data-r-1",
];
export function initReactiveHTML(store, root = document) {
    const bindingsByPath = new Map();
    const elements = root.querySelectorAll(REACTIVE_ATTRS.map(a => `[${a}]`).join(", "));
    elements.forEach(el => {
        const elBaseKey = el.getAttribute("data-base-key") || "";
        const reactiveAttrs = [];
        for (const attr of el.getAttributeNames()) {
            if (attr === "data-r" || /^data-r-\d+$/.test(attr)) {
                const val = el.getAttribute(attr);
                if (val)
                    reactiveAttrs.push(val.trim());
            }
        }
        reactiveAttrs.forEach(attrVal => {
            if (!attrVal)
                return;
            const parts = attrVal.split(",").map(p => p.trim());
            parts.forEach(part => {
                const [relativePath, type, attrName, ...exprArr] = part
                    .split(":")
                    .map(s => s.trim());
                if (!relativePath)
                    return;
                const fullPath = elBaseKey
                    ? `${elBaseKey}.${relativePath}`
                    : relativePath;
                const expr = exprArr.join(":");
                const computeValue = compileExpr(expr || undefined);
                const binding = {
                    el,
                    type: type || "innerHTML",
                    attrName: attrName || "",
                    computeValue,
                };
                const existing = bindingsByPath.get(fullPath);
                if (existing) {
                    existing.push(binding);
                }
                else {
                    bindingsByPath.set(fullPath, [
                        binding,
                    ]);
                }
            });
        });
    });
    bindingsByPath.forEach((bindings, fullPath) => {
        const path = fullPath.split(".");
        subscribePath(store, path, newValue => {
            for (const b of bindings) {
                applyBinding(b, newValue);
            }
        });
    });
}
//# sourceMappingURL=index.js.map