import { watchCheckbox, watchInput, watchNumber, watchRadio, watchRange, } from "./helpers.js";
const METADATA_KEY = Symbol.metadata ?? Symbol.for("Symbol.metadata");
function getMeta(ctor) {
    return ctor?.[METADATA_KEY] ?? {};
}
const warned = new Set();
function warnOnce(key, message) {
    if (warned.has(key))
        return;
    warned.add(key);
    console.warn(`[FlankerUi] ${message}`);
}
function missingElementMessage(viewName, decorator, key, meta) {
    if (key === null)
        return `${viewName}: ${decorator} targets the view root, but this.element is undefined. Set root or element before mount.`;
    if (meta._declaredQueries?.has(key))
        return `${viewName}: ${decorator} on "${key}" has no element. The @query/@queryAll selector matched nothing.`;
    return `${viewName}: ${decorator} on "${key}" has no element. Add @query()/@queryAll() or assign the element before mount.`;
}
export class UiView {
    element;
    root;
    _store = new Map();
    _updateScheduled = false;
    _mounted = false;
    mount() {
        if (this._mounted)
            return;
        this._mounted = true;
        if (this.root) {
            this.element =
                typeof this.root === "string"
                    ? document.querySelector(this.root)
                    : this.root;
        }
        const meta = getMeta(this.constructor);
        const viewName = this.constructor.name || "UiView";
        const hides = meta._declaredHides ?? new Map();
        for (const [key, { cell, negate }] of hides) {
            const el = key === null ? this.element : this[key];
            if (!el) {
                warnOnce(`${viewName}.hide.${key ?? "root"}`, missingElementMessage(viewName, "@hide", key, meta));
                continue;
            }
            cell.subscribe((visible) => {
                const show = negate ? !visible : visible;
                el.style.display = show ? "" : "none";
            });
        }
        const classes = meta._declaredClasses ?? new Map();
        for (const [key, { className, cell, negate }] of classes) {
            const el = key === null ? this.element : this[key];
            if (!el) {
                warnOnce(`${viewName}.classToggle.${key ?? "root"}`, missingElementMessage(viewName, `@classToggle("${className}")`, key, meta));
                continue;
            }
            cell.subscribe((val) => {
                const add = negate ? !val : val;
                el.classList.toggle(className, add);
            });
        }
        const attrs = meta._declaredAttrs ?? new Map();
        for (const [key, { attrName, cell, negate }] of attrs) {
            const el = key === null ? this.element : this[key];
            if (!el) {
                warnOnce(`${viewName}.attr.${key ?? "root"}`, missingElementMessage(viewName, `@attr("${attrName}")`, key, meta));
                continue;
            }
            cell.subscribe((val) => {
                const shouldSet = negate ? !val : val;
                if (shouldSet === null ||
                    shouldSet === undefined ||
                    shouldSet === false) {
                    el.removeAttribute(attrName);
                }
                else {
                    el.setAttribute(attrName, String(shouldSet));
                }
            });
        }
        const events = meta._declaredEvents ?? new Map();
        for (const [methodName, { event, selector }] of events) {
            const handler = this[methodName].bind(this);
            if (this.element) {
                if (selector) {
                    this.element.addEventListener(event, (e) => {
                        const match = e.target.closest(selector);
                        if (match && this.element.contains(match)) {
                            handler(match, e);
                        }
                    });
                }
                else {
                    this.element.addEventListener(event, handler);
                }
            }
        }
        const binds = meta._declaredBinds ?? [];
        for (const { propName, selector, type } of binds) {
            const cell = this._store.get(propName);
            if (!cell) {
                warnOnce(`${viewName}.bind.${propName}`, `${viewName}: @bind("${selector}", "${type}") on "${propName}" requires @prop() on the same property. Binding skipped.`);
                continue;
            }
            const el = this.element?.querySelector(selector);
            if (!el) {
                warnOnce(`${viewName}.bindElement.${propName}`, `${viewName}: @bind("${selector}", "${type}") on "${propName}" found no element for selector "${selector}". Binding skipped.`);
                continue;
            }
            switch (type) {
                case "value": {
                    watchInput(el, cell, true);
                    break;
                }
                case "number": {
                    watchNumber(el, cell, true);
                    break;
                }
                case "range": {
                    watchRange(el, cell, true);
                    break;
                }
                case "radio": {
                    watchRadio(this.element.querySelectorAll(selector), cell, true);
                    break;
                }
                case "checked": {
                    watchCheckbox(el, cell, true);
                    break;
                }
                case "text": {
                    el.textContent = cell.get() ?? "";
                    cell.subscribe(v => {
                        el.textContent = v ?? "";
                    });
                    break;
                }
                case "html": {
                    el.innerHTML = cell.get() ?? "";
                    cell.subscribe(v => {
                        el.innerHTML = v ?? "";
                    });
                    break;
                }
            }
        }
        this.mounted();
    }
    mounted() { }
    requestUpdate() {
        if (!this.element)
            return;
        if (this._updateScheduled)
            return;
        this._updateScheduled = true;
        Promise.resolve().then(() => {
            this._updateScheduled = false;
            this.onUpdate();
        });
    }
    onUpdate() { }
}
//# sourceMappingURL=view.js.map