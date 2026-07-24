import type { ReactiveCell } from "../store";

export interface PropOptions {
	attribute?: boolean | string;
	type?: Function;
}

export interface QueryOptions {
	selector: string;
	type: "querySelector" | "querySelectorAll";
}

export interface EventOptions {
	event: string;
	selector?: string;
}

export function prop(_target: any, name: string) {
	const Ctor = _target.constructor as any;
	if (!Object.hasOwn(Ctor, "_declaredProps")) {
		Ctor._declaredProps = new Map(Ctor._declaredProps ?? []);
	}
	Ctor._declaredProps.set(name, {});
}

export function query(selector: string) {
	return (proto: any, name: string) => {
		const Ctor = proto.constructor as any;
		if (!Object.hasOwn(Ctor, "_declaredQueries")) {
			Ctor._declaredQueries = new Map(Ctor._declaredQueries ?? []);
		}
		Ctor._declaredQueries.set(name, {
			selector,
			type: "querySelector",
		} as QueryOptions);

		Object.defineProperty(proto, name, {
			get(this: any) {
				return this.element?.querySelector(selector) ?? null;
			},
			configurable: true,
		});
	};
}

export function qi(selector: string) {
	return (proto: any, name: string) => {
		const Ctor = proto.constructor as any;
		if (!Object.hasOwn(Ctor, "_declaredQueries")) {
			Ctor._declaredQueries = new Map(Ctor._declaredQueries ?? []);
		}
		Ctor._declaredQueries.set(name, {
			selector,
			type: "querySelector",
		} as QueryOptions);

		Object.defineProperty(proto, name, {
			get(this: any) {
				return this.element?.querySelector(selector) ?? null;
			},
			configurable: true,
		});
	};
}

export function queryAll(selector: string) {
	return (proto: any, name: string) => {
		const Ctor = proto.constructor as any;
		if (!Object.hasOwn(Ctor, "_declaredQueries")) {
			Ctor._declaredQueries = new Map(Ctor._declaredQueries ?? []);
		}
		Ctor._declaredQueries.set(name, {
			selector,
			type: "querySelectorAll",
		} as QueryOptions);

		Object.defineProperty(proto, name, {
			get(this: any) {
				return this.element?.querySelectorAll(selector) ?? null;
			},
			configurable: true,
		});
	};
}

export function hide(storeCell: ReactiveCell<boolean>) {
	return (Ctor: any) => {
		if (!Object.hasOwn(Ctor, "_declaredHides")) {
			Ctor._declaredHides = new Map(Ctor._declaredHides ?? []);
		}
		Ctor._declaredHides.set("hide", storeCell);
		return Ctor;
	};
}

export function on(event: string, selector?: string) {
	return (proto: any, name: string) => {
		const Ctor = proto.constructor as any;
		if (!Object.hasOwn(Ctor, "_declaredEvents")) {
			Ctor._declaredEvents = new Map(Ctor._declaredEvents ?? []);
		}
		Ctor._declaredEvents.set(name, {
			event,
			selector,
		} as EventOptions);
	};
}
