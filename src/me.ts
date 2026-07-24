function me<T = HTMLElement>(selector: string = null): T {
	function getParent(selector: string, element: HTMLElement) {
		if (selector.startsWith("-")) {
			return getParent(selector.slice(1), element.parentElement);
		}
		return element.parentElement;
	}

	const element = document.currentScript.parentElement;
	if (selector === null) return element as T;
	return getParent(selector, element) as T;
}

window.me = me;
