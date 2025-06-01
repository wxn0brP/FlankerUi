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

    on(this: HTMLElement, event: string, fn: EventListenerOrEventListenerObject): void {
        this.addEventListener(event, fn);
    },

    css(this: HTMLElement, style: string | Record<string, string>, val: string | null = null): void {
        if (typeof style === "string") {
            if (val !== null) {
                this.style[style as any] = val;
            } else {
                (this.style as any).cssText = style;
            }
        } else {
            Object.assign(this.style, style);
        }
    },

    attrib(this: HTMLElement, att: string, arg: string | null = null): string | HTMLElement {
        if (arg !== null) {
            this.setAttribute(att, arg);
            return this;
        } else {
            return this.getAttribute(att) || "";
        }
    },

    clA(this: HTMLElement, arg: string): HTMLElement {
        this.classList.add(arg);
        return this;
    },

    clR(this: HTMLElement, arg: string): HTMLElement {
        this.classList.remove(arg);
        return this;
    },

    clT(this: HTMLElement, className: string): HTMLElement {
        this.classList.toggle(className);
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
        (this as any).fade = true;
        return this;
    },

    fadeOut(this: HTMLElement, cb?: () => void): HTMLElement {
        this.animateFade(1, { time: 300, cb });
        setTimeout(() => this.css("display", "none"), 300);
        (this as any).fade = false;
        return this;
    },

    fadeToggle(this: HTMLElement): HTMLElement {
        if ((this as any).fade) {
            this.fadeOut();
        } else {
            this.fadeIn();
        }
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

    fade: true,
};

Object.assign(HTMLElement.prototype, proto);