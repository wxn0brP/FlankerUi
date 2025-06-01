import { UiComponentBase } from "./base";

export type TemplateFn = ((data: any) => string) | string;

function renderTemplate(template: string) {
    return (data: any) => {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => data[key]);
    }
}

export function renderComponent(el: HTMLDivElement, data: any | any[], template: TemplateFn): void {
    el.innerHTML = "";
    const fn = typeof template === "string" ? renderTemplate(template) : template;
    if (Array.isArray(data)) {
        data.forEach(item => {
            el.innerHTML += fn(item);
        });
    } else {
        el.innerHTML = fn(data);
    }
}

export function autoRender(component: UiComponentBase, template: TemplateFn) {
    component.render = (data: any | any[]) => {
        renderComponent(component.element, data, template);
    };
}
