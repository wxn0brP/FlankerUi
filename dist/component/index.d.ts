export declare const componentVars: {
    fetchVQL<T>(query: string, vars?: object): Promise<T | T[]>;
};
export type QueryStringFunction = (...any: any[]) => Promise<string>;
export type QueryFunction = <T = any>(...any: any[]) => Promise<T>;
export interface ViewOptions<T = any> {
    selector: string | HTMLElement;
    query?: string | QueryStringFunction;
    queryFunction?: QueryFunction;
    queryArgs?: any[];
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
    load: (...args: any[]) => Promise<void>;
    element: HTMLElement;
};
export type MountView = ReturnType<typeof mountView>;
export * as uiHelpers from "./helpers.js";
