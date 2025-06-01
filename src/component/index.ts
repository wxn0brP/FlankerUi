import { UiComponent } from "../types";
import { autoTemplateComponent } from "./auto";
import { autoLoad, AutoLoadOptions } from "./autoLoad";
import { UiComponentBase } from "./base";
import { autoRender, TemplateFn } from "./autoRender";

export const componentVars: {
    fetchVQL<T>(query: string, vars?: object): Promise<T | T[]>
} = {
    fetchVQL: async () => ({} as any)
}

export interface CreateComponentOptions {
    selector: string;
    mount?(component: UiComponent, element: HTMLDivElement): void;
    loadOptions?: AutoLoadOptions;
    render?: TemplateFn;
    auto?: [TemplateFn, AutoLoadOptions]
}

export function createComponent(opts: CreateComponentOptions): UiComponentBase {
    const component = new UiComponentBase();

    component.mount = () => {
        component.element = document.querySelector(opts.selector);
        opts.mount?.(component, component.element);
    }

    if (opts.loadOptions) autoLoad(component, opts.loadOptions);
    if (opts.render) autoRender(component, opts.render);
    if (opts.auto) autoTemplateComponent(component, opts.auto[0], opts.auto[1]);

    return component;
}

export * as uiHelpers from "./helpers";