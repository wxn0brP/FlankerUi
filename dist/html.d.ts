declare const proto: {
    html(this: HTMLElement, v?: string): string | HTMLElement;
    v(this: HTMLInputElement, v?: string): string | HTMLInputElement;
    on(this: HTMLElement, event: string, fn: EventListenerOrEventListenerObject): void;
    css(this: HTMLElement, style: string | Record<string, string>, val?: string | null): void;
    attrib(this: HTMLElement, att: string, arg?: string | null): string | HTMLElement;
    clA(this: HTMLElement, arg: string): HTMLElement;
    clR(this: HTMLElement, arg: string): HTMLElement;
    clT(this: HTMLElement, className: string): HTMLElement;
    animateFade(this: HTMLElement, from: number, options?: {
        time?: number;
        cb?: () => void;
    }): HTMLElement;
    fadeIn(this: HTMLElement, display?: string | (() => void), cb?: () => void): HTMLElement;
    fadeOut(this: HTMLElement, cb?: () => void): HTMLElement;
    fadeToggle(this: HTMLElement): HTMLElement;
    add(this: HTMLElement, child: HTMLElement): HTMLElement;
    addUp(this: HTMLElement, child: HTMLElement): HTMLElement;
    fade: boolean;
};
