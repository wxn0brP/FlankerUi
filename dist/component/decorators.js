export function prop(_target, name) {
    const Ctor = _target.constructor;
    if (!Object.hasOwn(Ctor, "_declaredProps")) {
        Ctor._declaredProps = new Map(Ctor._declaredProps ?? []);
    }
    Ctor._declaredProps.set(name, {});
}
export function query(selector) {
    return (proto, name) => {
        const Ctor = proto.constructor;
        if (!Object.hasOwn(Ctor, "_declaredQueries")) {
            Ctor._declaredQueries = new Map(Ctor._declaredQueries ?? []);
        }
        Ctor._declaredQueries.set(name, {
            selector,
            type: "querySelector",
        });
        Object.defineProperty(proto, name, {
            get() {
                return this.element?.querySelector(selector) ?? null;
            },
            configurable: true,
        });
    };
}
export function qi(selector) {
    return (proto, name) => {
        const Ctor = proto.constructor;
        if (!Object.hasOwn(Ctor, "_declaredQueries")) {
            Ctor._declaredQueries = new Map(Ctor._declaredQueries ?? []);
        }
        Ctor._declaredQueries.set(name, {
            selector,
            type: "querySelector",
        });
        Object.defineProperty(proto, name, {
            get() {
                return this.element?.querySelector(selector) ?? null;
            },
            configurable: true,
        });
    };
}
export function queryAll(selector) {
    return (proto, name) => {
        const Ctor = proto.constructor;
        if (!Object.hasOwn(Ctor, "_declaredQueries")) {
            Ctor._declaredQueries = new Map(Ctor._declaredQueries ?? []);
        }
        Ctor._declaredQueries.set(name, {
            selector,
            type: "querySelectorAll",
        });
        Object.defineProperty(proto, name, {
            get() {
                return this.element?.querySelectorAll(selector) ?? null;
            },
            configurable: true,
        });
    };
}
export function hide(storeCell) {
    return (Ctor) => {
        if (!Object.hasOwn(Ctor, "_declaredHides")) {
            Ctor._declaredHides = new Map(Ctor._declaredHides ?? []);
        }
        Ctor._declaredHides.set("hide", storeCell);
        return Ctor;
    };
}
export function on(event, selector) {
    return (proto, name) => {
        const Ctor = proto.constructor;
        if (!Object.hasOwn(Ctor, "_declaredEvents")) {
            Ctor._declaredEvents = new Map(Ctor._declaredEvents ?? []);
        }
        Ctor._declaredEvents.set(name, {
            event,
            selector,
        });
    };
}
//# sourceMappingURL=decorators.js.map