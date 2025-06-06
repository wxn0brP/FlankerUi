export declare const componentVars: {
    fetchVQL<T>(query: string, vars?: object): Promise<T | T[]>;
};
type ViewOptions<T = any> = {
    selector: string;
    query: string | ((...args: any[]) => Promise<T>);
    queryArgs?: any[];
    transform?: (data: T) => any;
    sort?: string | ((a: any, b: any) => number);
    template: (item: any) => string;
    events?: {
        [eventType: string]: {
            [selector: string]: (el: HTMLElement, e: Event) => void;
        };
    };
};
export declare function mountView(opts: ViewOptions): {
    load: (...args: any[]) => Promise<void>;
    element: HTMLElement;
};
export * as uiHelpers from "./helpers.js";
