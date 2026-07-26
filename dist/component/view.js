import { watchCheckbox, watchInput, watchNumber } from "./helpers.js";
const METADATA_KEY = Symbol.metadata ?? Symbol.for("Symbol.metadata");
function getMeta(ctor) {
    return ctor?.[METADATA_KEY] ?? {};
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
        const hides = meta._declaredHides ?? new Map();
        for (const [key, { cell, negate }] of hides) {
            const el = key === null ? this.element : this[key];
            if (!el)
                continue;
            cell.subscribe((visible) => {
                const show = negate ? !visible : visible;
                el.style.display = show ? "" : "none";
            });
        }
        const classes = meta._declaredClasses ?? new Map();
        for (const [key, { className, cell, negate }] of classes) {
            const el = key === null ? this.element : this[key];
            if (!el)
                continue;
            cell.subscribe((val) => {
                const add = negate ? !val : val;
                el.classList.toggle(className, add);
            });
        }
        const attrs = meta._declaredAttrs ?? new Map();
        for (const [key, { attrName, cell, negate }] of attrs) {
            const el = key === null ? this.element : this[key];
            if (!el)
                continue;
            cell.subscribe((val) => {
                const shouldSet = negate ? !val : val;
                if (shouldSet === null || shouldSet === undefined || shouldSet === false) {
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
            const el = this.element.querySelector(selector);
            if (!el)
                continue;
            const cell = this._store.get(propName);
            if (!cell)
                continue;
            switch (type) {
                case "value": {
                    watchInput(el, cell, true);
                    break;
                }
                case "number": {
                    watchNumber(el, cell, true);
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