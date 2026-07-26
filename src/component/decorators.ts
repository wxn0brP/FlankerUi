import { ReactiveCell } from "../store";

type Metadata = Record<string | symbol, any>;

function readMeta(ctx: { metadata?: Metadata }): Metadata {
	return ctx.metadata ?? {};
}

export interface PropOptions {
	attribute?: boolean | string;
	type?: Function;
}

export type BindType = "value" | "number" | "checked" | "text" | "html";

export interface BindOptions {
	propName: string;
	selector: string;
	type: BindType;
}

export function prop(_opts?: PropOptions) {
	return (_target: any, context: ClassAccessorDecoratorContext) => {
		const name = context.name as string;
		const m = readMeta(context);
		if (!m._declaredProps) m._declaredProps = new Map();
		(m._declaredProps as Map<string, any>).set(name, {});

		context.addInitializer(function (this: any) {
			if (this._store.has(name)) return;

			const initialValue = this[name];
			const cell = new ReactiveCell(initialValue);
			this._store.set(name, cell);

			Object.defineProperty(this, name, {
				get: () => cell.get(),
				set: (v: any) => {
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

export function bind(selector: string, type: BindType = "value") {
	return (_target: any, context: ClassAccessorDecoratorContext) => {
		const name = context.name as string;
		const m = readMeta(context);
		if (!m._declaredBinds) m._declaredBinds = [];
		(m._declaredBinds as BindOptions[]).push({
			propName: name,
			selector,
			type,
		});
	};
}

export function hide(storeCell: ReactiveCell<boolean>, negate = false) {
	return (target: any, context: any) => {
		const m = readMeta(context);
		if (!m._declaredHides) m._declaredHides = new Map();
		const key = context.kind === "class" ? null : (context.name as string);
		(
			m._declaredHides as Map<
				string | null,
				{ cell: ReactiveCell<boolean>; negate: boolean }
			>
		).set(key, { cell: storeCell, negate });
		if (context.kind === "class") return target;
	};
}

export function classToggle(
	className: string,
	cell: ReactiveCell<boolean>,
	negate = false,
) {
	return (target: any, context: any) => {
		const m = readMeta(context);
		if (!m._declaredClasses) m._declaredClasses = new Map();
		const key = context.kind === "class" ? null : (context.name as string);
		(
			m._declaredClasses as Map<
				string | null,
				{ className: string; cell: ReactiveCell<boolean>; negate: boolean }
			>
		).set(key, { className, cell, negate });
		if (context.kind === "class") return target;
	};
}

export function attr(
	attrName: string,
	cell: ReactiveCell<any>,
	negate = false,
) {
	return (target: any, context: any) => {
		const m = readMeta(context);
		if (!m._declaredAttrs) m._declaredAttrs = new Map();
		const key = context.kind === "class" ? null : (context.name as string);
		(
			m._declaredAttrs as Map<
				string | null,
				{ attrName: string; cell: ReactiveCell<any>; negate: boolean }
			>
		).set(key, { attrName, cell, negate });
		if (context.kind === "class") return target;
	};
}

export function query(selector: string) {
	return (_target: any, context: ClassAccessorDecoratorContext) => {
		const name = context.name as string;
		const m = readMeta(context);
		if (!m._declaredQueries) m._declaredQueries = new Map();
		(
			m._declaredQueries as Map<
				string,
				{
					selector: string;
					type: "querySelector" | "querySelectorAll";
				}
			>
		).set(name, {
			selector,
			type: "querySelector",
		});

		context.addInitializer(function (this: any) {
			Object.defineProperty(this, name, {
				get() {
					return this.element?.querySelector(selector) ?? null;
				},
				configurable: true,
			});
		});
	};
}

export function queryAll(selector: string) {
	return (_target: any, context: ClassAccessorDecoratorContext) => {
		const name = context.name as string;
		const m = readMeta(context);
		if (!m._declaredQueries) m._declaredQueries = new Map();
		(
			m._declaredQueries as Map<
				string,
				{
					selector: string;
					type: "querySelector" | "querySelectorAll";
				}
			>
		).set(name, {
			selector,
			type: "querySelectorAll",
		});

		context.addInitializer(function (this: any) {
			Object.defineProperty(this, name, {
				get() {
					return this.element?.querySelectorAll(selector) ?? null;
				},
				configurable: true,
			});
		});
	};
}

export function on(event: string, selector?: string) {
	return (_target: any, context: ClassMethodDecoratorContext) => {
		const m = readMeta(context);
		if (!m._declaredEvents) m._declaredEvents = new Map();
		(m._declaredEvents as Map<string, any>).set(context.name as string, {
			event,
			selector,
		});
	};
}
