declare global {
    interface FUI {
        html(): string;
        html(v: string): HTMLElement;
        on(event: string, fn: EventListenerOrEventListenerObject): HTMLElement;
        css(style: string | Record<string, string>, val?: string | null): HTMLElement;
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
        /**
         * Query selector on the current element.
         * If did is truthy, it appends [data-id="${selector}"] to the selector.
         * @template T The type of the element to query
         * @param {string} selector The query selector string
         * @param {any} [did=0] The value to determine if the selector should be modified
         * @return {T} The queried element
         */
        qs<T = HTMLDivElement>(selector: string, did?: any): T;
        /** alias for qs but T=HTMLInputElement */
        qi<T = HTMLInputElement>(selector: string, did?: any): T;
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
    /**
     * Query selector on the document.
     * If did is truthy, it appends [data-id="${selector}"] to the selector.
     * @template T The type of the element to query
     * @param {string} selector The query selector string
     * @param {any} [did=0] The value to determine if the selector should be modified
     * @return {T} The queried element
     */
    function qs<T = HTMLDivElement>(selector: string, did?: any): T;
    /** alias for qs but T=HTMLInputElement */
    function qi<T = HTMLInputElement>(selector: string, did?: any): T;
}
export interface UiComponent {
    element: HTMLDivElement | HTMLInputElement | HTMLSelectElement | HTMLElement;
    mount(): void;
}
