export function storeHide(element, storeValue) {
    storeValue.subscribe((data) => {
        element.style.display = data ? "" : "none";
    });
}
export function bindHandlers(root, map, event = "click") {
    for (const [selector, handler] of Object.entries(map)) {
        const el = root.querySelector(selector);
        if (el)
            el.addEventListener(event, handler);
    }
}
export function renderList(container, items, renderItem, ifElse) {
    if (!items?.length && ifElse) {
        container.innerHTML = ifElse;
        return;
    }
    container.innerHTML = items.map(renderItem).join("");
}
export function renderListNodes(container, items, renderItem, ifElse) {
    container.innerHTML = "";
    if (!items?.length && ifElse) {
        typeof ifElse === "string" ? container.innerHTML = ifElse : container.appendChild(ifElse);
        return;
    }
    for (let i = 0; i < items.length; i++) {
        container.appendChild(renderItem(items[i], i));
    }
}
export function watchInput(el, store) {
    el.addEventListener("input", () => {
        store.set(el.value);
    });
    store.subscribe(value => {
        if (el.value !== value)
            el.value = value;
    });
}
export function watchSelect(el, store) {
    el.addEventListener("change", () => {
        store.set(el.value);
    });
    store.subscribe(value => {
        if (el.value !== value)
            el.value = value;
    });
}
export function watchCheckbox(el, store) {
    el.addEventListener("change", () => {
        store.set(el.checked);
    });
    store.subscribe(value => {
        if (el.checked !== value)
            el.checked = value;
    });
}
export function htmlToElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}
//# sourceMappingURL=helpers.js.map