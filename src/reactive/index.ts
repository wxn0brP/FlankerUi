import { StoreType } from "../store";

interface ReactiveBinding {
	el: HTMLElement;
	type: string;
	attrName: string;
	computeValue: (v: any) => any;
}

function compileExpr(expr: string | undefined): (v: any) => any {
	if (!expr) return (v: any) => v;
	if (expr === "!") return (v: any) => !v;
	try {
		return new Function("v", `return (${expr})`) as (v: any) => any;
	} catch (e) {
		console.error("Reactive expression error:", e, expr);
		return (v: any) => v;
	}
}

function applyBinding(b: ReactiveBinding, val: any) {
	if (val === undefined) return;

	const result = b.computeValue(val);

	switch (b.type) {
		case "attr":
			if (result === false) b.el.removeAttribute(b.attrName);
			else b.el.setAttribute(b.attrName, result);
			break;
		case "style":
			if (b.attrName) (b.el.style as any)[b.attrName] = result;
			break;
		case "class":
			if (result) b.el.classList.add(b.attrName);
			else b.el.classList.remove(b.attrName);
			break;
		case "textContent":
			b.el.textContent = result;
			break;
		case "innerHTML":
			b.el.innerHTML = result;
			break;
		default:
			console.warn("Unknown reactive type:", b.type);
			break;
	}
}

function subscribePath(
	store: any,
	path: string[],
	callback: (val: any) => void,
) {
	let current = store;

	for (let i = 0; i < path.length - 1; i++) {
		const key = path[i];
		const cell = current[key];
		if (cell && cell.isStore) {
			current = cell;
		} else {
			console.warn(`Reactive: path "${path.join(".")}" not found in store`);
			return;
		}
	}

	const leafKey = path[path.length - 1];
	const cell = current[leafKey];

	if (!cell || cell.isStore || typeof cell.subscribe !== "function") {
		console.warn(`Reactive: cell "${path.join(".")}" not found in store`);
		return;
	}

	cell.subscribe((val: any) => callback(val));
	callback(cell.get());
}

const REACTIVE_ATTRS = [
	"data-r",
	"data-r-0",
	"data-r-1",
];

export function initReactiveHTML<T extends StoreType<{}>>(
	store: T,
	root: HTMLElement | Document = document,
) {
	const bindingsByPath = new Map<string, ReactiveBinding[]>();

	const elements = root.querySelectorAll<HTMLElement>(
		REACTIVE_ATTRS.map(a => `[${a}]`).join(", "),
	);

	elements.forEach(el => {
		const elBaseKey = el.getAttribute("data-base-key") || "";

		const reactiveAttrs: string[] = [];
		for (const a of REACTIVE_ATTRS) {
			const val = el.getAttribute(a);
			if (val) reactiveAttrs.push(val.trim());
		}

		reactiveAttrs.forEach(attrVal => {
			if (!attrVal) return;

			const parts = attrVal.split(",").map(p => p.trim());

			parts.forEach(part => {
				const [relativePath, type, attrName, ...exprArr] = part
					.split(":")
					.map(s => s.trim());
				if (!relativePath) return;

				const fullPath = elBaseKey
					? `${elBaseKey}.${relativePath}`
					: relativePath;

				const expr = exprArr.join(":");
				const computeValue = compileExpr(expr || undefined);

				const binding: ReactiveBinding = {
					el,
					type: type || "innerHTML",
					attrName: attrName || "",
					computeValue,
				};

				const existing = bindingsByPath.get(fullPath);
				if (existing) {
					existing.push(binding);
				} else {
					bindingsByPath.set(fullPath, [
						binding,
					]);
				}
			});
		});
	});

	bindingsByPath.forEach((bindings, fullPath) => {
		const path = fullPath.split(".");
		subscribePath(store, path, newValue => {
			for (const b of bindings) {
				applyBinding(b, newValue);
			}
		});
	});
}
