declare global {
    interface HTMLElement {
        html(): string;
        html(v: string): HTMLElement;
        on(event: string, fn: EventListenerOrEventListenerObject): void;
        css(style: string | Record<string, string>, val?: string | null): void;
        attrib(att: string): string;
        attrib(att: string, arg: string): HTMLElement;
        clA(...arg: string[]): HTMLElement;
        clR(...arg: string[]): HTMLElement;
        clT(className: string, force?: boolean): HTMLElement;
        animateFade(from: number, options?: {
            time?: number;
            cb?: () => void;
        }): HTMLElement;
        fadeIn(display?: string | (() => void), cb?: () => void): HTMLElement;
        fadeOut(cb?: () => void): HTMLElement;
        fadeToggle(): HTMLElement;
        add(child: HTMLElement): HTMLElement;
        addUp(child: HTMLElement): HTMLElement;
        fade: boolean;
        qs<T = HTMLDivElement>(selector: string): T;
        qsi<T = HTMLInputElement>(selector: string): T;
        qi<T = HTMLDivElement>(id: string): T;
        qii<T = HTMLInputElement>(id: string): T;
    }
    interface HTMLInputElement {
        v(): string;
        v(v: string): HTMLInputElement;
    }
    interface HTMLSelectElement {
        v(): string;
        v(v: string): HTMLSelectElement;
    }
    interface HTMLTextAreaElement {
        v(): string;
        v(v: string): HTMLTextAreaElement;
    }
    var lo: typeof console.log;
}
export interface UiComponent {
    element: HTMLDivElement | HTMLInputElement | HTMLSelectElement | HTMLElement;
    mount(): void;
}
