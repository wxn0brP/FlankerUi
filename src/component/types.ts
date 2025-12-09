import type { VQLUQ } from "@wxn0brp/vql-client/vql";
import { UiComponent } from "../types";

export type QueryFunction<T = any> = (...any: any[]) => Promise<T>;
export type TemplateDataMode = "append" | "prepend" | "replace";

export interface ViewOptions<VQL = any> {
    selector: string | HTMLElement;
    query?: VQLUQ<VQL> | QueryFunction<VQLUQ<VQL>>;
    queryFunction?: QueryFunction;
    queryArgs?: { [key: string]: any };
    transform?: (data: any) => any;
    sort?: string | ((a: any, b: any) => number);
    template: (item: any) => string;
    emptyData?: string;
    templateDataMode?: TemplateDataMode;
    events?: {
        [eventType: string]: {
            [selector: string]: (el: HTMLElement, e: Event) => void;
        };
    };
    onData?: (data: any) => void;
    onDataTransform?: (data: any) => any;
    onDataSort?: (data: any) => number;
};

export interface MountViewExtra {
    load: (args?: { [key: string]: any }) => Promise<void>;
    render: (data: any) => void;
}

export type MountViewComponent = UiComponent & MountViewExtra;
export type MountView<Extra extends Record<string, any> = {}> = MountViewComponent & Extra;