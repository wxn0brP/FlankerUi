# State Management with `createStore`

`createStore` turns a plain object into a tree of reactive cells.
Leaf values, including arrays, become `ReactiveCell`s. Nested objects become nested stores.

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

- `get()` - read the current value.
- `set(value, propagate?)` - update the value and notify subscribers.
- `subscribe(listener)` - register a listener and return the cell for chaining. Listeners are not called immediately.
- `notify(propagate?)` - notify subscribers without changing the value.
- `value`, `listeners`, `isStore` - internal fields.

`set()` compares the new value with the current one using `Object.is`. Setting the same value does not notify subscribers:

```typescript
const cell = appStore.counter;

cell.set(2);   // notifies
cell.set(2);   // same value, no notification
cell.notify(); // notifies without changing the value
```

Arrays are leaves. Mutating an array in place and passing the same reference to `set()` does not notify. Pass a new array instead.

The optional `propagate` argument tells the cell how many parent stores should also emit their own notification. The default is `0`.

```typescript
appStore.user.name.set("Alice", 1);
// also notifies appStore.user
```

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

`store.set()` rejects nested stores and object values. Use the leaf cell directly for those.

Use `getPointer()` to get the cells instead of values:

```typescript
const cells = appStore.user.getPointer();
cells.name.set("Bob");
```

Store level `subscribe()` receives the store object, not a value:

```typescript
appStore.subscribe((store) => {
  console.log(store.get());
});
```

## Persistence

`persist` saves selected cells to storage and restores them when it is created.

```typescript
import { createStore, persist } from "@wxn0brp/flanker-ui";

const appStore = createStore({
  user: {
    name: "Guest"
  },
  settings: {
    theme: "dark",
    volume: 0.5
  }
});

const saved = persist(appStore, {
  key: "my-app",
  pick: [ "user", "settings.theme" ],
  debounce: 150
});

saved.save();  // write immediately
saved.clear(); // remove the stored entry
```

Options:

- `key` - storage key. Required.
- `storage` - object with `getItem`, `setItem`, and `removeItem`. Defaults to `localStorage` when available.
- `pick` - list of cell paths to store. A path also matches its children, so `"settings"` stores `settings.theme` and `settings.volume`. Without `pick`, the whole store is stored.
- `debounce` - delay before writing after a change. Defaults to `100` ms.
- `serialize` - custom function that turns the snapshot into a string.
- `deserialize` - custom function that turns the stored string into an object.

`persist` reads the stored value once, when it is called, and applies it to matching cells. Later changes to those cells are written back automatically. Storage and JSON errors are logged with `console.error` and do not throw.

Because `set()` skips identical values, writing the same value does not trigger another save.
