function readMeta(ctx) {
    return ctx.metadata ?? {};
}
export function prop(_target, context) {
    const m = readMeta(context);
    if (!m._declaredProps)
        m._declaredProps = new Map();
    m._declaredProps.set(context.name, {});
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
export function hide(storeCell) {
    return (target, context) => {
        const m = readMeta(context);
        if (!m._declaredHides)
            m._declaredHides = new Map();
        m._declaredHides.set("hide", storeCell);
        return target;
    };
}
export function listen(event, selector) {
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
//# sourceMappingURL=decorators.js.map