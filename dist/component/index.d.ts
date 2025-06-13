import { VQLQuery } from "@wxn0brp/vql-client";
export type QueryFunction<T = any> = (...any: any[]) => Promise<T>;
export interface ViewOptions<T = any> {
    selector: string | HTMLElement;
    query?: VQLQuery | QueryFunction<VQLQuery>;
    queryFunction?: QueryFunction;
    queryArgs?: {
        [key: string]: any;
    };
    transform?: (data: T) => any;
    sort?: string | ((a: any, b: any) => number);
    template: (item: any) => string;
    events?: {
        [eventType: string]: {
            [selector: string]: (el: HTMLElement, e: Event) => void;
        };
    };
}
export declare function mountView(opts: ViewOptions): {
    load: (args?: {
        [key: string]: any;
    }) => Promise<void>;
    element: HTMLElement;
};
export type MountView = ReturnType<typeof mountView>;
export * as uiHelpers from "./helpers.js";
