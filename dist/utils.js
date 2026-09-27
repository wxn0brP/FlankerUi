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
export function get(url) {
    if (!url)
        return "";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.responseText;
    }
    else if (xhr.status === 404) {
        return "";
    }
    else {
        return "";
    }
}
export function getJSON(url) {
    return JSON.parse(get(url));
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