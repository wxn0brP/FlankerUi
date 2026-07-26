import { ReactiveCell } from "../store";
import type { UiComponent } from "../types";
import { watchCheckbox, watchInput, watchNumber } from "./helpers";
import type { BindOptions } from "./decorators";

const METADATA_KEY = (Symbol as any).metadata ?? Symbol.for("Symbol.metadata");

function getMeta(ctor: any): any {
	return ctor?.[METADATA_KEY] ?? {};
}

export class UiView implements UiComponent {
	element!: HTMLElement;
	root?: string | HTMLElement;

	_store: Map<string, ReactiveCell<any>> = new Map();
	_updateScheduled = false;
	_mounted = false;

	mount() {
		if (this._mounted) return;
		this._mounted = true;

		if (this.root) {
			this.element =
				typeof this.root === "string"
					? (document.querySelector(this.root) as HTMLElement)
					: this.root;
		}

		const meta = getMeta(this.constructor as any);

		const hides: Map<
			string | null,
			{ cell: ReactiveCell<boolean>; negate: boolean }
		> = meta._declaredHides ?? new Map();
		for (const [key, { cell, negate }] of hides) {
			const el =
				key === null ? this.element : (this as any)[key as string];
			if (!el) continue;
			cell.subscribe((visible: boolean) => {
				const show = negate ? !visible : visible;
				el.style.display = show ? "" : "none";
			});
		}

		const classes: Map<
			string | null,
			{ className: string; cell: ReactiveCell<boolean>; negate: boolean }
		> = meta._declaredClasses ?? new Map();
		for (const [key, { className, cell, negate }] of classes) {
			const el =
				key === null ? this.element : (this as any)[key as string];
			if (!el) continue;
			cell.subscribe((val: boolean) => {
				const add = negate ? !val : val;
				el.classList.toggle(className, add);
			});
		}

		const attrs: Map<
			string | null,
			{ attrName: string; cell: ReactiveCell<any>; negate: boolean }
		> = meta._declaredAttrs ?? new Map();
		for (const [key, { attrName, cell, negate }] of attrs) {
			const el =
				key === null ? this.element : (this as any)[key as string];
			if (!el) continue;
			cell.subscribe((val: any) => {
				const shouldSet = negate ? !val : val;
				if (shouldSet === null || shouldSet === undefined || shouldSet === false) {
					el.removeAttribute(attrName);
				} else {
					el.setAttribute(attrName, String(shouldSet));
				}
			});
		}

		const events: Map<
			string,
			{
				event: string;
				selector?: string;
			}
		> = meta._declaredEvents ?? new Map();
		for (const [methodName, { event, selector }] of events) {
			const handler = (this as any)[methodName].bind(this);
			if (this.element) {
				if (selector) {
					this.element.addEventListener(event, (e: Event) => {
						const match = (e.target as HTMLElement).closest(selector);
						if (match && this.element.contains(match)) {
							handler(match, e);
						}
					});
				} else {
					this.element.addEventListener(event, handler);
				}
			}
		}

		const binds: BindOptions[] = meta._declaredBinds ?? [];
		for (const { propName, selector, type } of binds) {
			const el = this.element.querySelector(selector) as HTMLElement;
			if (!el) continue;
			const cell = this._store.get(propName);
			if (!cell) continue;

			switch (type) {
				case "value": {
					watchInput(
						el as HTMLInputElement,
						cell as ReactiveCell<string>,
						true,
					);
					break;
				}
				case "number": {
					watchNumber(
						el as HTMLInputElement,
						cell as ReactiveCell<number>,
						true,
					);
					break;
				}
				case "checked": {
					watchCheckbox(
						el as HTMLInputElement,
						cell as ReactiveCell<boolean>,
						true,
					);
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

	mounted() {}

	requestUpdate() {
		if (!this.element) return;
		if (this._updateScheduled) return;
		this._updateScheduled = true;
		Promise.resolve().then(() => {
			this._updateScheduled = false;
			this.onUpdate();
		});
	}

	onUpdate() {}
}
