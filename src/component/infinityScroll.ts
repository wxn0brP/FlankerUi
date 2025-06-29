import { mountView } from ".";

export interface InfiniteScrollOptions {
    threshold?: number;
    pageSize?: number;
}

export function enableInfiniteScroll(
    component: ReturnType<typeof mountView>,
    options: InfiniteScrollOptions = {}
): () => void {
    const {
        threshold = 200,
        pageSize = 10,
    } = options;

    let page = 0;
    let loading = false;
    let hasMore = true;

    const el = component.element;
    const loadFn = component.load;

    async function handleScroll() {
        if (loading || !hasMore) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        if (!(scrollHeight - scrollTop - clientHeight <= threshold)) return;
        await load();
    }

    async function load() {
        loading = true;

        try {
            await loadFn({ offset: page * pageSize, limit: pageSize });
            page++;
        } catch (e) {
            console.error("[FlankerUi] Error during infinite scroll load", e);
            hasMore = false;
        } finally {
            loading = false;
        }
    }

    el.addEventListener("scroll", handleScroll);
    load();

    return () => {
        el.removeEventListener("scroll", handleScroll);
    };
}