function me(selector = null) {
    function getParent(selector, element) {
        if (selector.startsWith("-")) {
            return getParent(selector.slice(1), element.parentElement);
        }
        return element.parentElement;
    }
    let element = document.currentScript.parentElement;
    if (selector === null)
        return element;
    return getParent(selector, element);
}
window.me = me;
//# sourceMappingURL=me.js.map