import { StoreType } from "../store.js";
import { ReactiveCbParams } from "./walk.js";
export declare function reactFromAttr(attrVal: string, el: HTMLElement, params: ReactiveCbParams): void;
export declare function initReactiveHTML<T extends StoreType<{}>>(store: T, root?: HTMLElement | Document): void;
