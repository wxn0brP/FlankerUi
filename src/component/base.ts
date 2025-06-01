import { UiComponent } from "../types";

export class UiComponentBase implements UiComponent {
    element: HTMLDivElement;

    q<T=HTMLInputElement>(selector: string): T {
        return this.element.querySelector(selector) as T;
    }

    mount(): void {
        throw new Error("Method not implemented.");
    }

    render(...args: any): void {
        throw new Error("Method not implemented.");
    }

    load(...args: any): void {
        throw new Error("Method not implemented.");
    }
}