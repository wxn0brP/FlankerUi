# State Management with `createStore`

`createStore` turns a plain object into a tree of reactive cells.
Leaf values become `ReactiveCell`s, and nested objects become nested stores.

```typescript
import { createStore, storeUtils } from "@wxn0brp/flanker-ui";

const appStore = createStore({
  isAuthenticated: false,
  user: {
    name: "Guest",
    theme: "dark"
  },
  counter: 0
});

appStore.counter.subscribe((newValue) => {
  console.log("Counter changed to:", newValue);
});

appStore.counter.set(1);
appStore.user.name.set("Alice");
storeUtils.incrementCell(appStore.counter);
```

## Cells

Every leaf cell supports:

- `get()` - read the current value and participate in dependency tracking.
- `set(value, propagate?)` - update the value and notify subscribers.
- `subscribe(listener)` - listen to changes; returns an unsubscribe function.
- `notify(propagate?)` - notify subscribers without changing the value.

The dependency list is collected from `get()` calls inside the callback.

## Whole Store Values

Use `get()` on the store to read a plain object snapshot.

```typescript
console.log(appStore.get());
// { isAuthenticated: false, user: { name: "Alice", theme: "dark" }, counter: 2 }
```

Use `set()` on the store for shallow leaf updates.

```typescript
appStore.set({
  isAuthenticated: true,
  counter: 10
});
```

Nested stores are updated through their leaf cells:

```typescript
appStore.user.theme.set("light");
```
