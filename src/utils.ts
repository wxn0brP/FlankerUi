export function rand(min: number, max: number): number {
	return Math.round(Math.random() * (max - min) + min);
}

export function round(number: number, decimalPlaces: number): number {
	const multiplier = Math.pow(10, decimalPlaces);
	return Math.round(number * multiplier) / multiplier;
}

export function clamp(min: number, value: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

const htmlEscapes: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

export function escapeHTML(value: unknown): string {
	return String(value ?? "").replace(/[&<>"']/g, char => htmlEscapes[char]);
}

export async function getJSON<T = any>(url: string): Promise<T | null> {
	const response = await fetch(url);
	if (!response.ok) return null;

	const text = await response.text();
	if (!text) return null;

	return JSON.parse(text) as T;
}

export function debounce<T = Function>(func: Function, wait: number = 100): T {
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

export function throttle<T = Function>(func: Function, wait: number = 100): T {
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
