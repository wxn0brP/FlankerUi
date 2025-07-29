export function toggleBoolean(cell) {
    cell.set(!cell.get());
    return cell;
}
export function updateCell(cell, fn) {
    cell.set(fn(cell.get()));
    return cell;
}
export function pushToCell(cell, item) {
    cell.set([...cell.get(), item]);
    return cell;
}
export function toggleInSetCell(cell, item) {
    const next = new Set(cell.get());
    next.has(item) ? next.delete(item) : next.add(item);
    cell.set(next);
    return cell;
}
export function incrementCell(cell, by = 1) {
    cell.set(cell.get() + by);
    return cell;
}
export function decrementCell(cell, by = 1) {
    cell.set(cell.get() - by);
    return cell;
}
//# sourceMappingURL=storeUtils.js.map