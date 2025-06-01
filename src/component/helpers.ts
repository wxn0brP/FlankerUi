export function storeHide(component: HTMLElement, storeValue: { subscribe: (fn: (data: any) => void) => void }) {
    storeValue.subscribe((data) => {
        component.style.display = data ? "" : "none";
    });
}

export function bindHandlers(root: HTMLElement, map: Record<string, () => void>, event: string = "click") {
    for (const [selector, handler] of Object.entries(map)) {
        const el = root.querySelector(selector);
        if (el) el.addEventListener(event, handler);
    }
}
