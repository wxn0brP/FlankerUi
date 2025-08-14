declare global {
    interface FUI {
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
        fadeInP(display?: string): Promise<HTMLElement>;
        fadeOutP(): Promise<HTMLElement>;
        fadeToggle(): HTMLElement;
        add(child: HTMLElement): HTMLElement;
        addUp(child: HTMLElement): HTMLElement;
        fade: boolean;
        /** query selector */
        qs<T = HTMLDivElement>(selector: string): T;
        /** query selector input */
        qsi<T = HTMLInputElement>(selector: string): T;
        /** query id */
        qi<T = HTMLDivElement>(id: string): T;
        /** query id input */
        qii<T = HTMLInputElement>(id: string): T;
    }
    interface FUI_value<T> {
        v(): string;
        v(v: string): T;
    }
    interface HTMLElement extends FUI {
    }
    interface HTMLBodyElement extends FUI {
    }
    interface Document extends FUI {
    }
    interface HTMLInputElement extends FUI_value<HTMLInputElement> {
    }
    interface HTMLSelectElement extends FUI_value<HTMLSelectElement> {
    }
    interface HTMLTextAreaElement extends FUI_value<HTMLTextAreaElement> {
    }
    var lo: typeof console.log;
    /** query selector */
    function qs<T = HTMLDivElement>(selector: string): T;
    /** query selector input */
    function qsi<T = HTMLInputElement>(selector: string): T;
    /** query id */
    function qi<T = HTMLDivElement>(id: string): T;
    /** query id input */
    function qii<T = HTMLInputElement>(id: string): T;
}
export interface UiComponent {
    element: HTMLDivElement | HTMLInputElement | HTMLSelectElement | HTMLElement;
    mount(): void;
}
