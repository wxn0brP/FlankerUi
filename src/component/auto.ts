import { AutoLoadOptions, autoLoad } from "./autoLoad";
import { UiComponentBase } from "./base";
import { TemplateFn, autoRender } from "./autoRender";

export function autoTemplateComponent<T = any>(
    component: UiComponentBase,
    template: TemplateFn,
    options: string | AutoLoadOptions<T>
) {
    autoRender(component, template);
    autoLoad(component, options);
}
