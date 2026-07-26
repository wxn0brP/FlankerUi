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

export function hide(storeCell: ReactiveCell<boolean>) {
	return (target: Function, context: ClassDecoratorContext) => {
		const m = readMeta(context);
		if (!m._declaredHides) m._declaredHides = new Map();
		(m._declaredHides as Map<string, ReactiveCell<boolean>>).set(
			"hide",
			storeCell,
		);
		return target;
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

export const listen = on;
