import { ReactiveCell } from "../store.js";
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
    constructor() {
        const meta = getMeta(this.constructor);
        const props = meta._declaredProps ?? new Map();
        for (const [name] of props) {
            const cell = new ReactiveCell(undefined);
            this._store.set(name, cell);
            Object.defineProperty(this, name, {
                get: () => cell.get(),
                set: (v) => {
                    if (cell.get() !== v) {
                        cell.set(v);
                        this.requestUpdate();
                    }
                },
                configurable: true,
                enumerable: true,
            });
        }
    }
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
        const hides = meta._declaredHides ??
            new Map();
        for (const [, storeCell] of hides) {
            storeCell.subscribe((visible) => {
                if (this.element) {
                    this.element.style.display = visible ? "" : "none";
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