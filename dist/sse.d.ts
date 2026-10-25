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
export declare class SSEClient<T extends EventMap = {}> extends VEE<T & SSEEventMap> {
    private url;
    private opts;
    private eventSource;
    private _status;
    private _reconnectAttempts;
    private reconnectTimeout;
    constructor(url: string, opts?: SSEOptions);
    get status(): SSEStatus;
    get reconnectAttempts(): number;
    connect(): void;
    disconnect(): void;
}
export {};
