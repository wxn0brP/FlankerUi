import { componentVars } from ".";
import { UiComponentBase } from "./base";

export type AutoLoadQuery =
    | string
    | ((...args: any[]) => string)
    | [string, (...args: any[]) => object];

export type AutoLoadOptions<T = any> = {
    query: AutoLoadQuery;
    transform?: (data: any) => T;
    afterLoad?: (data?: T) => void;
} | string;

export function autoLoad<T = any>(component: UiComponentBase, options: AutoLoadOptions<T>) {
    if (typeof options === "string") 
        options = { query: options };
    
    const { query, transform } = options;

    component.load = async (...args: any[]) => {
        let q: string;
        let params: any;

        if (typeof query === "string") {
            q = query;
            params = {} as any;
            if (args.length === 1 && typeof args[0] === "object") {
                params = args[0];
            } else {
                args.forEach((arg, i) => (params[i.toString()] = arg));
            }
        } else if (typeof query === "function") {
            q = query(...args);
        } else if (Array.isArray(query)) {
            q = query[0];
            params = query[1](...args);
        }

        const data = await componentVars.fetchVQL<T>(
            q, params as object
        );

        const finalData = transform ? transform(data) : data;
        component.render(finalData);

        options.afterLoad?.(data as T);
    };
}
