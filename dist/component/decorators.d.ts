import { ReactiveCell } from "../store.js";
export interface PropOptions {
    attribute?: boolean | string;
    type?: Function;
}
export type BindType = "value" | "number" | "checked" | "text" | "html";
export interface BindOptions {
    propName: string;
    selector: string;
    type: BindType;
}
export declare function prop(_opts?: PropOptions): (_target: any, context: ClassAccessorDecoratorContext) => void;
export declare function bind(selector: string, type?: BindType): (_target: any, context: ClassAccessorDecoratorContext) => void;
export declare function hide(storeCell: ReactiveCell<boolean>, negate?: boolean): (target: any, context: any) => any;
export declare function classToggle(className: string, cell: ReactiveCell<boolean>, negate?: boolean): (target: any, context: any) => any;
export declare function attr(attrName: string, cell: ReactiveCell<any>, negate?: boolean): (target: any, context: any) => any;
export declare function query(selector: string): (_target: any, context: ClassAccessorDecoratorContext) => void;
export declare function queryAll(selector: string): (_target: any, context: ClassAccessorDecoratorContext) => void;
export declare function on(event: string, selector?: string): (_target: any, context: ClassMethodDecoratorContext) => void;
