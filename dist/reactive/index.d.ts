import { StoreType } from "../store.js";
import { ReactiveCbParams } from "./walk.js";
export declare function reactFromAttr(attrVal: string, el: HTMLElement, params: ReactiveCbParams): void;
export declare function initReactiveHTML(store: StoreType<any>, root?: HTMLElement | Document): void;
