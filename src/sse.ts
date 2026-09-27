import { VEE, EventMap } from "@wxn0brp/event-emitter";

type SSEStatus = "connecting" | "connected" | "disconnected";

interface SSEOptions {
	withCredentials?: boolean;
	reconnectInterval?: number;
	maxReconnectAttempts?: number;
	onOpen?: () => void;
	onError?: (error: Event) => void;
	onClose?: () => void;
}

interface SSEEventMap extends EventMap {
	"*": (event: string, data: any) => void;
}

export class SSEClient<T extends EventMap = {}> extends VEE<T & SSEEventMap> {
	private url: string;
	private opts: SSEOptions;
	private eventSource: EventSource | null = null;
	private _status: SSEStatus = "disconnected";
	private _reconnectAttempts = 0;
	private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

	constructor(url: string, opts: SSEOptions = {}) {
		super();
		this.url = url;
		this.opts = opts;
	}

	get status() {
		return this._status;
	}

	get reconnectAttempts() {
		return this._reconnectAttempts;
	}

	connect() {
		if (this._status === "connected" || this._status === "connecting") return;

		this._status = "connecting";
		this.eventSource = new EventSource(this.url, {
			withCredentials: this.opts.withCredentials ?? false,
		});

		this.eventSource.onopen = () => {
			this._status = "connected";
			this._reconnectAttempts = 0;
			this.opts.onOpen?.();
		};

		this.eventSource.onmessage = event => {
			try {
				const eventName = event.type || "";
				const data = JSON.parse(event.data);
				this._emit(eventName, data);
			} catch (e) {
				console.error("SSE parse error:", e);
			}
		};

		this.eventSource.onerror = event => {
			this._status = "disconnected";
			this.opts.onError?.(event);
			this.eventSource?.close();
			this.eventSource = null;

			const max = this.opts.maxReconnectAttempts ?? 0;
			if (max === 0 || this._reconnectAttempts < max) {
				this._reconnectAttempts++;
				this.reconnectTimeout = setTimeout(() => {
					this.reconnectTimeout = null;
					this.connect();
				}, this.opts.reconnectInterval ?? 3000);
			}
		};
	}

	disconnect() {
		if (this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
			this.reconnectTimeout = null;
		}

		if (this.eventSource) {
			this.eventSource.close();
			this.eventSource = null;
		}

		this._status = "disconnected";
		this._reconnectAttempts = 0;
		this.opts.onClose?.();
	}
}
