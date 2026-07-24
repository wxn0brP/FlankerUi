import type { ReactiveCell } from "../store";

type Metadata = Record<string | symbol, any>;

function readMeta(ctx: { metadata?: Metadata }): Metadata {
	return ctx.metadata ?? {};
}

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

export function prop(_target: any, context: ClassAccessorDecoratorContext) {
	const m = readMeta(context);
	if (!m._declaredProps) m._declaredProps = new Map();
	(m._declaredProps as Map<string, any>).set(context.name as string, {});
}

export function query(selector: string) {
	return (_target: any, context: ClassAccessorDecoratorContext) => {
		const name = context.name as string;
		const m = readMeta(context);
		if (!m._declaredQueries) m._declaredQueries = new Map();
		(m._declaredQueries as Map<string, QueryOptions>).set(name, {
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
		(m._declaredQueries as Map<string, QueryOptions>).set(name, {
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

export function listen(event: string, selector: string) {
	return (_target: any, context: ClassMethodDecoratorContext) => {
		const m = readMeta(context);
		if (!m._declaredEvents) m._declaredEvents = new Map();
		(m._declaredEvents as Map<string, EventOptions>).set(
			context.name as string,
			{
				event,
				selector,
			},
		);
	};
}
