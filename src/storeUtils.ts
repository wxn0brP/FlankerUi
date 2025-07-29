import { ReactiveCell } from "./store";

export function toggleBoolean(cell: ReactiveCell<boolean>) {
    cell.set(!cell.get());
    return cell;
}

export function updateCell<T>(cell: ReactiveCell<T>, fn: (val: T) => T) {
    cell.set(fn(cell.get()));
    return cell;
}

export function pushToCell<T>(cell: ReactiveCell<T[]>, item: T) {
    cell.set([...cell.get(), item]);
    return cell;
}

export function toggleInSetCell<T>(cell: ReactiveCell<Set<T>>, item: T) {
    const next = new Set(cell.get());
    next.has(item) ? next.delete(item) : next.add(item);
    cell.set(next);
    return cell;
}

export function incrementCell(cell: ReactiveCell<number>, by = 1) {
    cell.set(cell.get() + by);
    return cell;
}

export function decrementCell(cell: ReactiveCell<number>, by = 1) {
    cell.set(cell.get() - by);
    return cell;
}