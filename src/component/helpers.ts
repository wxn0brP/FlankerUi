import { ReactiveCell } from "../store";

export function storeHide(element: HTMLElement, storeValue: ReactiveCell<boolean | any>) {
    storeValue.subscribe((data) => {
        element.style.display = data ? "" : "none";
    });
}

export function bindHandlers(root: HTMLElement, map: Record<string, () => void>, event: string = "click") {
    for (const [selector, handler] of Object.entries(map)) {
        const el = root.querySelector(selector);
        if (el) el.addEventListener(event, handler);
    }
}

export function renderList<T>(
    container: HTMLElement,
    items: T[],
    renderItem: (item: T, index: number) => string,
    ifElse?: string
) {
    if (!items?.length && ifElse) {
        container.innerHTML = ifElse;
        return;
    }
    container.innerHTML = items.map(renderItem).join("");
}

export function renderListNodes<T>(
    container: HTMLElement,
    items: T[],
    renderItem: (item: T, index: number) => HTMLElement,
    ifElse?: string | HTMLElement
) {
    container.innerHTML = "";
    if (!items?.length && ifElse) {
        typeof ifElse === "string" ? container.innerHTML = ifElse : container.appendChild(ifElse);
        return;
    }
    for (let i = 0; i < items.length; i++) {
        container.appendChild(renderItem(items[i], i));
    }
}

export function watchInput(el: HTMLInputElement, store: ReactiveCell<string>) {
    el.addEventListener("input", () => {
        store.set(el.value);
    });
    store.subscribe(value => {
        if (el.value !== value) el.value = value;
    });
}

export function watchSelect(el: HTMLSelectElement, store: ReactiveCell<string>) {
    el.addEventListener("change", () => {
        store.set(el.value);
    });
    store.subscribe(value => {
        if (el.value !== value) el.value = value;
    });
}

export function watchCheckbox(el: HTMLInputElement, store: ReactiveCell<boolean>) {
    el.addEventListener("change", () => {
        store.set(el.checked);
    });
    store.subscribe(value => {
        if (el.checked !== value) el.checked = value;
    });
}

export function htmlToElement<T=HTMLElement>(html: string): T {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild as T;
}
