import { UiComponent } from "../types";
import { autoTemplateComponent } from "./auto";
import { autoLoad, AutoLoadOptions } from "./autoLoad";
import { UiComponentBase } from "./base";
import { autoRender, TemplateFn } from "./autoRender";
import { EventEngineBinder } from "./event";

export const componentVars: {
    fetchVQL<T>(query: string, vars?: object): Promise<T | T[]>
} = {
    fetchVQL: async () => ({} as any)
}

export interface CreateComponentOptions {
    selector: string | HTMLDivElement;
    mount?(component: UiComponent, element: HTMLDivElement): void;
    loadOptions?: AutoLoadOptions;
    render?: TemplateFn;
    autoLoad?: [TemplateFn, AutoLoadOptions];
    data?: any
}

export function createComponent(opts: CreateComponentOptions): UiComponentBase {
    const component = new UiComponentBase();

    component.mount = () => {
        component.element = typeof opts.selector === "string" ? document.querySelector(opts.selector) : opts.selector;
        new EventEngineBinder(component.element, component.eventEngine);
        opts.mount?.(component, component.element);
    }

    if (opts.data) component.data = opts.data;
    if (opts.loadOptions) autoLoad(component, opts.loadOptions);
    if (opts.render) autoRender(component, opts.render);
    if (opts.autoLoad) autoTemplateComponent(component, opts.autoLoad[0], opts.autoLoad[1]);

    return component;
}

export * as uiHelpers from "./helpers";
export * as UIEvents from "./event";