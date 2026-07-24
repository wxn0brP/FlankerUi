import { ReactiveCell } from "../store.js";
export class UiView {
    element;
    root;
    _store = new Map();
    _updateScheduled = false;
    _mounted = false;
    constructor() {
        const Ctor = this.constructor;
        const props = Ctor._declaredProps ?? new Map();
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
        const Ctor = this.constructor;
        const hides = Ctor._declaredHides ??
            new Map();
        for (const [, storeCell] of hides) {
            storeCell.subscribe((visible) => {
                if (this.element) {
                    this.element.style.display = visible ? "" : "none";
                }
            });
        }
        const events = Ctor._declaredEvents ?? new Map();
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
//# sourceMappingURL=uicomponent.js.map