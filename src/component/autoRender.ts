import { UiComponentBase } from "./base";

export type TemplateFn = ((data: any) => string) | string;

function getValue(obj: any, key: string) {
    const keys = key.split(".");
    let value = obj;
    for (const k of keys) {
        value = value[k];
    }
    return value;
}

function renderTemplate(template: string) {
    return (data: any, self?: any) => {
        return template
            .replace(/\{\{\}\}/g, (match, key) => data.toString())
            .replace(/\{\{\_\.(\w+)\}\}/g, (match, key) => {
                try {
                    return getValue(self, key);
                } catch (e) {
                    return "";
                }
            })
            .replace(/\{\{(\w+)\}\}/g, (match, key) => {
                try {
                    return getValue(data, key);
                } catch (e) {
                    return "";
                }
            })
    }
}

export function renderComponent(component: UiComponentBase, data: any | any[], template: TemplateFn): void {
    const { element } = component;
    element.innerHTML = "";
    const fn = typeof template === "string" ? renderTemplate(template) : template;
    if (Array.isArray(data)) {
        data.forEach(item => {
            element.innerHTML += fn(item, component.data);
        });
    } else {
        element.innerHTML = fn(data, component.data);
    }
}

export function autoRender(component: UiComponentBase, template: TemplateFn) {
    component.render = (data: any | any[]) => {
        renderComponent(component, data, template);
    };
}
