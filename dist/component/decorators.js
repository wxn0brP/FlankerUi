import { ReactiveCell } from "../store.js";
function readMeta(ctx) {
    return ctx.metadata ?? {};
}
export function prop(_opts) {
    return (_target, context) => {
        const name = context.name;
        const m = readMeta(context);
        if (!m._declaredProps)
            m._declaredProps = new Map();
        m._declaredProps.set(name, {});
        context.addInitializer(function () {
            if (this._store.has(name))
                return;
            const initialValue = this[name];
            const cell = new ReactiveCell(initialValue);
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
        });
    };
}
export function bind(selector, type = "value") {
    return (_target, context) => {
        const name = context.name;
        const m = readMeta(context);
        if (!m._declaredBinds)
            m._declaredBinds = [];
        m._declaredBinds.push({
            propName: name,
            selector,
            type,
        });
    };
}
export function hide(storeCell) {
    return (target, context) => {
        const m = readMeta(context);
        if (!m._declaredHides)
            m._declaredHides = new Map();
        m._declaredHides.set("hide", storeCell);
        return target;
    };
}
export function query(selector) {
    return (_target, context) => {
        const name = context.name;
        const m = readMeta(context);
        if (!m._declaredQueries)
            m._declaredQueries = new Map();
        m._declaredQueries.set(name, {
            selector,
            type: "querySelector",
        });
        context.addInitializer(function () {
            Object.defineProperty(this, name, {
                get() {
                    return this.element?.querySelector(selector) ?? null;
                },
                configurable: true,
            });
        });
    };
}
export function queryAll(selector) {
    return (_target, context) => {
        const name = context.name;
        const m = readMeta(context);
        if (!m._declaredQueries)
            m._declaredQueries = new Map();
        m._declaredQueries.set(name, {
            selector,
            type: "querySelectorAll",
        });
        context.addInitializer(function () {
            Object.defineProperty(this, name, {
                get() {
                    return this.element?.querySelectorAll(selector) ?? null;
                },
                configurable: true,
            });
        });
    };
}
export function on(event, selector) {
    return (_target, context) => {
        const m = readMeta(context);
        if (!m._declaredEvents)
            m._declaredEvents = new Map();
        m._declaredEvents.set(context.name, {
            event,
            selector,
        });
    };
}
export const listen = on;
//# sourceMappingURL=decorators.js.map