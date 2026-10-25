import { ReactiveCell } from "../store.js";
import type { UiComponent } from "../types.js";
export declare class UiView implements UiComponent {
    element: HTMLElement;
    root?: string | HTMLElement;
    _store: Map<string, ReactiveCell<any>>;
    _updateScheduled: boolean;
    _mounted: boolean;
    mount(): void;
    mounted(): void;
    requestUpdate(): void;
    onUpdate(): void;
}
