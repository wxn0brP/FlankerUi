const proto = {
    html(this: HTMLElement, v?: string): string | HTMLElement {
        if (v !== undefined) {
            this.innerHTML = v;
            return this;
        } else {
            return this.innerHTML;
        }
    },

    v(this: HTMLInputElement, v?: string): string | HTMLInputElement {
        if (v !== undefined) {
            this.value = v;
            return this;
        } else {
            return this.value;
        }
    },

    on(this: HTMLElement, event: string, fn: EventListenerOrEventListenerObject) {
        this.addEventListener(event, fn);
        return this;
    },

    css(this: HTMLElement, style: string | Record<string, string>, val: string | null = null) {
        if (typeof style === "string") {
            if (val !== null) {
                this.style[style] = val;
            } else {
                this.style.cssText = style;
            }
        } else {
            Object.assign(this.style, style);
        }
        return this;
    },

    attrib(this: HTMLElement, att: string, arg: string | null = null): string | HTMLElement {
        if (arg !== null) {
            this.setAttribute(att, arg);
            return this;
        } else {
            return this.getAttribute(att) || "";
        }
    },

    clA(this: HTMLElement, ...arg: string[]): HTMLElement {
        this.classList.add(...arg);
        return this;
    },

    clR(this: HTMLElement, ...arg: string[]): HTMLElement {
        this.classList.remove(...arg);
        return this;
    },

    clT(this: HTMLElement, className: string, force?: boolean): HTMLElement {
        this.classList.toggle(className, force);
        return this;
    },

    animateFade(this: HTMLElement, from: number, options: { time?: number; cb?: () => void } = {}): HTMLElement {
        const { time = 200, cb } = options;
        const style = this.style;
        const steps = 50;
        const timeToStep = time / steps;
        const d = (from === 0 ? 1 : -1) / steps;
        let index = 0;
        style.opacity = from.toString();

        const interval = setInterval(() => {
            if (index >= steps) {
                clearInterval(interval);
                cb?.();
                return;
            }
            style.opacity = (parseFloat(style.opacity || "0") + d).toString();
            index++;
        }, timeToStep);
        return this;
    },

    fadeIn(this: HTMLElement, display: string | (() => void) = "block", cb?: () => void): HTMLElement {
        if (typeof display === "function") {
            cb = display;
            display = "block";
        }

        this.css("display", display);
        this.animateFade(0, { cb });
        this.fade = true;
        return this;
    },

    fadeOut(this: HTMLElement, cb?: () => void): HTMLElement {
        this.animateFade(1, { time: 300, cb });
        setTimeout(() => this.css("display", "none"), 300);
        this.fade = false;
        return this;
    },

    async fadeInP(this: HTMLElement, display: string = "block"): Promise<HTMLElement> {
        new Promise<void>((resolve) => {
            this.fadeIn(display, resolve);
        });
        return this;
    },

    async fadeOutP(): Promise<HTMLElement> {
        new Promise<void>((resolve) => {
            this.fadeOut(resolve);
        });
        return this;
    },

    fade: true,
    fadeToggle(this: HTMLElement): HTMLElement {
        this.fade ? this.fadeOut() : this.fadeIn();
        return this;
    },

    add(this: HTMLElement, child: HTMLElement): HTMLElement {
        this.appendChild(child);
        return this;
    },

    addUp(this: HTMLElement, child: HTMLElement): HTMLElement {
        this.insertBefore(child, this.firstChild);
        return this;
    },

    qs<T = HTMLDivElement>(this: HTMLElement, selector: string, did: any = 0): T {
        if (!!did) selector = `[data-id="${selector}"]`;
        return this.querySelector(selector) as T;
    },

    qi<T = HTMLInputElement>(this: HTMLElement, selector: string, did: any = 0): T {
        return this.qs<T>(selector, did) as T;
    },
};

Object.assign(HTMLElement.prototype, proto);
Object.assign(document, proto);
Object.assign(document.body, proto);
Object.assign(document.documentElement, proto);
for (const name of ["qs", "qi"]) {
    if (typeof proto[name] === "function") {
        window[name] = function (...args: any[]) {
            return proto[name].apply(document, args);
        };
    }
}