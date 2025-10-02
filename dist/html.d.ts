declare const proto: {
    html(this: HTMLElement, v?: string): string | HTMLElement;
    v(this: HTMLInputElement, v?: string): string | HTMLInputElement;
    on(this: HTMLElement, event: string, fn: EventListenerOrEventListenerObject): HTMLElement;
    css(this: HTMLElement, style: string | Record<string, string>, val?: string | null): HTMLElement;
    attrib(this: HTMLElement, att: string, arg?: string | null): string | HTMLElement;
    clA(this: HTMLElement, ...arg: string[]): HTMLElement;
    clR(this: HTMLElement, ...arg: string[]): HTMLElement;
    clT(this: HTMLElement, className: string, force?: boolean): HTMLElement;
    animateFade(this: HTMLElement, from: number, options?: {
        time?: number;
        cb?: () => void;
    }): HTMLElement;
    fadeIn(this: HTMLElement, display?: string | (() => void), cb?: () => void): HTMLElement;
    fadeOut(this: HTMLElement, cb?: () => void): HTMLElement;
    fadeInP(this: HTMLElement, display?: string): Promise<HTMLElement>;
    fadeOutP(): Promise<HTMLElement>;
    fade: boolean;
    fadeToggle(this: HTMLElement): HTMLElement;
    add(this: HTMLElement, child: HTMLElement): HTMLElement;
    addUp(this: HTMLElement, child: HTMLElement): HTMLElement;
    qs<T = HTMLDivElement>(this: HTMLElement, selector: string, did?: any): T;
    qi<T = HTMLInputElement>(this: HTMLElement, selector: string, did?: any): T;
};
