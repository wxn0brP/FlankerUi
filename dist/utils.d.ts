export declare function rand(min: number, max: number): number;
export declare function round(number: number, decimalPlaces: number): number;
export declare function clamp(min: number, value: number, max: number): number;
export declare function get(url: string): string;
export declare function getJSON<T = any>(url: string): T;
export declare function debounce<T = Function>(func: Function, wait?: number): T;
export declare function throttle<T = Function>(func: Function, wait?: number): T;
export declare function delay(ms: number): Promise<void>;
