export function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
export function round(number, decimalPlaces) {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(number * multiplier) / multiplier;
}
export function clamp(min, value, max) {
    return Math.min(Math.max(value, min), max);
}
const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};
export function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => htmlEscapes[char]);
}
export async function getJSON(url) {
    const response = await fetch(url);
    if (!response.ok)
        return null;
    const text = await response.text();
    if (!text)
        return null;
    return JSON.parse(text);
}
export function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
export function throttle(func, wait = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
}
export function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}
//# sourceMappingURL=utils.js.map