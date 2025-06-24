import { VqlQueryRaw } from "@wxn0brp/vql-client/dist/vql";
export type QueryFunction<T = any> = (...any: any[]) => Promise<T>;
export interface ViewOptions<T = any> {
    selector: string | HTMLElement;
    query?: VqlQueryRaw | QueryFunction<VqlQueryRaw>;
    queryFunction?: QueryFunction;
    queryArgs?: {
        [key: string]: any;
    };
    transform?: (data: T) => any;
    sort?: string | ((a: any, b: any) => number);
    template: (item: any) => string;
    events?: {
        [eventType: string]: {
            [selector: string]: <EL = HTMLElement, E = Event>(el: EL, e: E) => void;
        };
    };
    onData?: (data: any) => void;
    onDataTransform?: (data: any) => any;
    onDataSort?: (data: any) => number;
}
export declare function mountView(opts: ViewOptions): {
    load: (args?: {
        [key: string]: any;
    }) => Promise<void>;
    element: HTMLElement;
};
export type MountView = ReturnType<typeof mountView>;
export * as uiHelpers from "./helpers.js";
