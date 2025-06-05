export function rand(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
}

export function round(a: number, b: number): number {
    const factor = Math.pow(10, b);
    return Math.round(a * factor) / factor;
}

export function clamp(min: number, value: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function get(url: string): string{
    if (!url) return "";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();

    if (xhr.status === 200) {
        return xhr.responseText;
    } else if (xhr.status === 404) {
        return "";
    } else {
        return "";
    }
}

export function getJSON<T=any>(url: string): T {
    return JSON.parse(get(url));
}

export function debounce<T=Function>(func: Function, wait: number = 100): T {
    let timeout: any;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    } as T;
}

export function throttle<T=Function>(func: Function, wait: number = 100): T {
    let inThrottle: boolean;
    return function executedFunction(...args: any[]) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    } as T;
}

export function delay(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
}