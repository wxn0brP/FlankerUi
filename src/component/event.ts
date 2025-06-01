export type EventHandler = (args: Record<string, any>, event: Event) => void;

export class EventEngine {
    private events: Record<string, EventHandler> = {};

    register(id: string, handler: EventHandler) {
        this.events[id] = handler;
    }

    trigger(id: string, args: Record<string, any>, event: Event) {
        const handler = this.events[id];
        if (handler) {
            handler(args, event);
        } else {
            console.warn(`[EventEngine] No handler registered for "${id}"`);
        }
    }
}

function parseValue(val: string): any {
    if (val === "true") return true;
    if (val === "false") return false;
    if (!isNaN(+val)) return +val;
    try {
        return JSON.parse(val);
    } catch {
        return val;
    }
}

export class EventEngineBinder {
    constructor(private root: HTMLElement, private eventEngine: EventEngine) {
        this.root.addEventListener("click", (e) => {
            const target = (e.target as HTMLElement).closest<HTMLElement>("[data-click]");
            if (!target || !this.root.contains(target)) return;

            const eventId = target.dataset.click;
            if (!eventId) return;

            const args: Record<string, any> = {};
            for (const attr of target.attributes) {
                if (attr.name.startsWith("data-") && attr.name !== "data-click") {
                    const key = attr.name.slice(5);
                    args[key] = parseValue(attr.value);
                }
            }

            this.eventEngine.trigger(eventId, args, e);
        });
    }
}

export function createEventEngine(element: HTMLElement) {
    const eventEngine = new EventEngine();
    new EventEngineBinder(element, eventEngine);
    return eventEngine;
}