import { MountView } from "./types.js";
export interface InfiniteScrollOptions {
    threshold?: number;
    pageSize?: number;
}
export declare function enableInfiniteScroll(component: MountView, options?: InfiniteScrollOptions): () => void;
