export function enableInfiniteScroll(component, options = {}) {
    const { threshold = 200, pageSize = 10, } = options;
    const cmp = component;
    let page = 0;
    const el = cmp.element;
    const loadFn = cmp.load;
    async function handleScroll() {
        if (cmp.loading || !cmp.hasMore)
            return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (!(scrollHeight - scrollTop - clientHeight <= threshold))
            return;
        await load();
    }
    async function load() {
        cmp.loading = true;
        try {
            await loadFn({ offset: page * pageSize, limit: pageSize });
            page++;
        }
        catch (e) {
            console.error("[FlankerUi] Error during infinite scroll load", e);
            cmp.hasMore = false;
        }
        finally {
            cmp.loading = false;
        }
    }
    el.addEventListener("scroll", handleScroll);
    load();
    return () => {
        el.removeEventListener("scroll", handleScroll);
    };
}
//# sourceMappingURL=infinityScroll.js.map