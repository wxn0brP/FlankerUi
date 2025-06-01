import { UiComponent } from "../types";
import { EventEngine } from "./event";

export class UiComponentBase implements UiComponent {
    element: HTMLDivElement;
    data: any;
    eventEngine: EventEngine = new EventEngine();

    q<T=HTMLInputElement>(selector: string): T {
        return this.element.querySelector(selector) as T;
    }

    mount(): void {
        throw new Error("Method not implemented.");
    }

    render(...args: any): void {
        throw new Error("Method not implemented.");
    }

    async load(...args: any) {
        throw new Error("Method not implemented.");
    }
}