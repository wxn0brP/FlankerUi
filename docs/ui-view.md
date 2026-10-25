# UiView and Decorators

`UiView` is a small class based component with reactive properties and decorator based DOM bindings. It uses standard TypeScript decorators, so `experimentalDecorators` is not needed.

```typescript
import { UiView } from "@wxn0brp/flanker-ui";

class SearchView extends UiView {
  root = "#search";

  mounted() {
    console.log("ready", this.element);
  }
}

const view = new SearchView();
view.mount();
```

## Lifecycle

- `root` - a selector or an `HTMLElement`. It is resolved during `mount()`. You can also assign `element` directly.
- `element` - the root element of the view.
- `mount()` - resolves the root, wires decorators, then calls `mounted()`. Calling it twice does nothing.
- `mounted()` - hook called after the element is ready and decorators are attached.
- `requestUpdate()` - schedules `onUpdate()` in a microtask. Multiple calls in the same tick produce one update.
- `onUpdate()` - hook for responding to reactive property changes.

## How Decorators Work

Decorators do not touch the DOM. They write declarations into class metadata. `mount()` reads that metadata and performs the actual work.

This means:

- The class must extend `UiView`.
- `mount()` must be called.
- `@prop`, `@bind`, `@query`, and `@queryAll` require an `accessor` field.
- Warnings are emitted for incomplete declarations, so a silently skipped binding is easier to spot.

## `@prop()`

Turns an accessor into a reactive property backed by a `ReactiveCell`.

```typescript
class CounterView extends UiView {
  @prop() accessor count = 0;

  onUpdate() {
    this.element.textContent = String(this.count);
  }
}
```

Reading the property calls `cell.get()`. Writing it calls `cell.set()` and `requestUpdate()`.

`PropOptions` (`attribute` and `type`) are reserved and currently ignored.

## `@bind(selector, type)`

Connects a reactive property to an element inside the view.

```typescript
class SearchView extends UiView {
  root = "#search";

  @prop()
  @bind("#search-input", "value")
  accessor query = "";

  @prop()
  @bind("#result-count", "text")
  accessor count = 0;
}
```

`@bind` requires a cell for the same property. Add `@prop()` to the same accessor. Without it, the binding is skipped and a warning is printed.

Binding types:

| Type | Helper | Direction |
| --- | --- | --- |
| `value` | `watchInput` | two-way |
| `number` | `watchNumber` | two-way |
| `range` | `watchRange` | two-way |
| `radio` | `watchRadio` | two-way |
| `checked` | `watchCheckbox` | two-way |
| `text` | `textContent` | cell to DOM |
| `html` | `innerHTML` | cell to DOM |

Two-way types read the element value during `mount()`, so the DOM is the initial source of truth. `text` and `html` use the cell value as the initial state.

For `radio`, the selector is used with `querySelectorAll`, so it should match the whole group.

## `@hide(cell, negate?)`

Shows the element when the cell is truthy and hides it otherwise.

```typescript
class SearchView extends UiView {
  root = "#search";

  @hide(store.loading)
  @query("#spinner")
  accessor spinner: HTMLElement;
}
```

On a class, the decorator controls the view root:

```typescript
@hide(store.loading)
class SearchView extends UiView {
  root = "#search";
}
```

`negate` reverses the meaning.

## `@classToggle(className, cell, negate?)`

Adds or removes a class based on a cell.

```typescript
class PanelView extends UiView {
  root = "#panel";

  @classToggle("is-active", store.active)
  @query("#panel-body")
  accessor body: HTMLElement;
}
```

It also works on the class to target the view root.

## `@attr(attrName, cell, negate?)`

Sets or removes an attribute based on a cell.

```typescript
class PanelView extends UiView {
  root = "#panel";

  @attr("aria-busy", store.loading)
  @query("#panel-body")
  accessor body: HTMLElement;
}
```

When the value is `null`, `undefined`, or `false`, the attribute is removed. Otherwise it is set as a string.

## `@query(selector)` and `@queryAll(selector)`

Define getters that query inside `this.element`.

```typescript
class ListView extends UiView {
  root = "#list";

  @query("#list-header") accessor header: HTMLElement;
  @queryAll(".list-row") accessor rows: NodeListOf<HTMLElement>;
}
```

The result is not cached. Each access runs `querySelector` or `querySelectorAll` again, so it stays correct after `innerHTML` changes. Before `mount()` and when nothing matches, the value is `null`.

## `@on(event, selector?)`

Attaches a method as an event listener on `this.element`.

```typescript
class ListView extends UiView {
  root = "#list";

  @on("click", ".delete")
  onDelete(match: HTMLElement, event: MouseEvent) {
    console.log("delete", match.dataset.id);
  }

  @on("keydown")
  onKey(event: KeyboardEvent) {
    console.log(event.key);
  }
}
```

With `selector`, the event is delegated through `closest()` and the handler receives `(match, event)`. Without a selector, the handler receives `(event)`. `this` is bound to the view instance.

## Warnings

`mount()` prints `console.warn` messages when a decorator is incomplete. Warnings are deduplicated per class, decorator, and property, so multiple instances do not spam the console.

`@bind` without `@prop`:

```
[FlankerUi] SearchView: @bind("#search-input", "value") on "query" requires @prop() on the same property. Binding skipped.
```

`@bind` with a selector that matches nothing:

```
[FlankerUi] SearchView: @bind("#search-input", "value") on "query" found no element for selector "#search-input". Binding skipped.
```

`@hide`, `@classToggle`, or `@attr` on a property without an element:

```
[FlankerUi] SearchView: @hide on "spinner" has no element. Add @query()/@queryAll() or assign the element before mount.
```

When `@query` is present but the selector matched nothing:

```
[FlankerUi] SearchView: @hide on "spinner" has no element. The @query/@queryAll selector matched nothing.
```

A class level decorator without a root element:

```
[FlankerUi] SearchView: @classToggle("is-active") targets the view root, but this.element is undefined. Set root or element before mount.
```

Warnings do not throw and do not change behavior. The affected binding is skipped.

## Initial State

`@hide`, `@classToggle`, and `@attr` subscribe to their cell. The initial state is applied on the next notification, not during `mount()`.

If the element must reflect the current cell value immediately, notify it in `mounted()`:

```typescript
mounted() {
  store.loading.notify();
}
```

## Full Example

```typescript
import { UiView, createStore } from "@wxn0brp/flanker-ui";

const store = createStore({
  loading: false,
  query: "",
  volume: 0.5,
  plan: "free"
});

class SettingsView extends UiView {
  root = "#settings";

  @prop()
  @bind("#query", "value")
  accessor query = "";

  @prop()
  @bind("#volume", "range")
  accessor volume = 0.5;

  @prop()
  @bind("input[name=plan]", "radio")
  accessor plan = "free";

  @hide(store.loading)
  @query("#spinner")
  accessor spinner: HTMLElement;

  @on("click", "#save")
  onSave() {
    store.set({
      query: this.query,
      volume: this.volume,
      plan: this.plan
    });
  }

  mounted() {
    store.loading.notify();
  }
}

new SettingsView().mount();
```
