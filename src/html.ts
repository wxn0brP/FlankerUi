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

    animateFade(
        this: HTMLElement,
        from: number,
        options: { time?: number; cb?: () => void } = {}
    ): HTMLElement {
        const { time = 200, cb } = options;
        const element = this;
        const targetOpacity = from === 0 ? 1 : 0;

        const startOpacity = Math.min(1, Math.max(0, from));
        const startTime = performance.now();

        element.style.opacity = startOpacity.toString();

        function step(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / time, 1);

            const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
            element.style.opacity = currentOpacity.toString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.style.opacity = targetOpacity.toString();
                cb?.();
            }
        }

        requestAnimationFrame(step);
        return this;
    },

    fadeIn(this: HTMLElement, ...args: any): HTMLElement {
        const opts = convert({
            display: "string",
            cb: "function",
            time: "number",
        }, args);

        let { display = "block" } = opts;

        this.css("display", display);
        this.animateFade(0, opts);
        this.fade = true;
        return this;
    },

    fadeOut(this: HTMLElement, ...args: any[]): HTMLElement {
        const opts = convert({
            cb: "function",
            time: "number",
        }, args);
        const time = opts.time ?? 300;
        opts.time = time;
        this.animateFade(1, {
            ...opts,
            cb: () => {
                this.css("display", "none");
                opts.cb?.();
            }
        });
        this.fade = false;
        return this;
    },

    async fadeInP(this: HTMLElement, ...args: any[]): Promise<HTMLElement> {
        return new Promise<HTMLElement>((resolve) => {
            this.fadeIn(...args, () => resolve(this));
        });
    },

    async fadeOutP(this: HTMLElement, ...args: any[]): Promise<HTMLElement> {
        return new Promise<HTMLElement>((resolve) => {
            this.fadeOut(...args, () => resolve(this));
        });
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
    }
};
// @ts-ignore
proto.qi = proto.qs;

function convert(
    opts: Record<string, string>,
    args: any[]
): Record<string, any> {
    const result: Record<string, any> = {};
    if (args.length === 0) return result;
    if (args.every((arg) => typeof arg === "object")) return Object.assign({}, ...args);

    for (const value of args) {
        for (const [key, expectedType] of Object.entries(opts)) {
            if (typeof value === expectedType) {
                result[key] = value;
                break;
            }
        }
    }

    return result;
}

Object.assign(HTMLElement.prototype, proto);
Object.assign(document, proto);
Object.assign(document.body, proto);
Object.assign(document.documentElement, proto);
window.qs = window.qi = proto.qs.bind(document);