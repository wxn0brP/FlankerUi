import { mountView } from "./index.js";
export interface InfiniteScrollOptions {
    threshold?: number;
    pageSize?: number;
}
export declare function enableInfiniteScroll(component: ReturnType<typeof mountView>, options?: InfiniteScrollOptions): () => void;
