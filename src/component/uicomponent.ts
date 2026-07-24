import { ReactiveCell } from "../store";
import type { UiComponent } from "../types";

export class UiView implements UiComponent {
	element!: HTMLElement;
	root?: string | HTMLElement;

	_store: Map<string, ReactiveCell<any>> = new Map();
	_updateScheduled = false;
	_mounted = false;

	constructor() {
		const Ctor = this.constructor as any;
		const props: Map<string, any> = Ctor._declaredProps ?? new Map();

		for (const [name] of props) {
			const cell = new ReactiveCell(undefined);
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
		}
	}

	mount() {
		if (this._mounted) return;
		this._mounted = true;

		if (this.root) {
			this.element =
				typeof this.root === "string"
					? (document.querySelector(this.root) as HTMLElement)
					: this.root;
		}

		const Ctor = this.constructor as any;

		const hides: Map<string, ReactiveCell<boolean>> = Ctor._declaredHides ??
		new Map();
		for (const [, storeCell] of hides) {
			storeCell.subscribe((visible: boolean) => {
				if (this.element) {
					this.element.style.display = visible ? "" : "none";
				}
			});
		}

		const events: Map<
			string,
			{
				event: string;
				selector?: string;
			}
		> = Ctor._declaredEvents ?? new Map();
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
