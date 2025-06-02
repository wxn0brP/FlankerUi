import { UiComponentBase } from "./base";

export type TemplateFn = ((data: any) => string) | string;

function getValue(obj: any, key: string): any {
    const keys = key.split(".");
    let value = obj;
    for (const k of keys) {
        if (value == null) return "";
        value = value[k];
    }
    return value;
}

function escapeHtml(str: string): string {
    return str.replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

export function compileTemplateAdvanced(template: string) {
    return function render(data: any, self: any = {}) {
        let output = template;

        // each block
        output = output.replace(/\{\{#each (\w+)\}\}([\s\S]+?)\{\{\/each\}\}/g, (_, key, block) => {
            const list = getValue(data, key);
            if (!Array.isArray(list)) return "";
            return list.map(item => renderMini(block, item, self)).join("");
        });

        // if block
        output = output.replace(/\{\{#if (\w+)\}\}([\s\S]+?)\{\{\/if\}\}/g, (_, key, block) => {
            const cond = getValue(data, key);
            return cond ? renderMini(block, data, self) : "";
        });

        // {{_.key}} (self context)
        output = output.replace(/\{\{\_\.(\w+)\}\}/g, (_, key) => {
            try {
                return escapeHtml(String(getValue(self, key) ?? ""));
            } catch { return ""; }
        });

        // {{key}} (data context)
        output = output.replace(/\{\{(\w+)\}\}/g, (_, key) => {
            try {
                return escapeHtml(String(getValue(data, key) ?? ""));
            } catch { return ""; }
        });

        // {{}} — full string
        output = output.replace(/\{\{\}\}/g, () => escapeHtml(String(data?.toString() ?? "")));

        return output;
    };

    function renderMini(tpl: string, data: any, self: any) {
        return compileTemplateAdvanced(tpl)(data, self);
    }
}

export function renderComponent(component: UiComponentBase, data: any | any[], template: TemplateFn): void {
    const { element } = component;
    element.innerHTML = "";
    const fn = typeof template === "string" ? compileTemplateAdvanced(template) : template;
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
