# Forms and Helpers

Form helpers connect inputs to `ReactiveCell`s. They are exported from the `uiHelpers` namespace and from the `component/helpers` subpath.

```typescript
import { uiHelpers } from "@wxn0brp/flanker-ui";

uiHelpers.watchInput(qs("#name"), store.name);
```

Examples use the global `qs()` helper from [DOM Extensions](dom-extensions.md).

The same helpers are available directly:

```typescript
import { watchInput } from "@wxn0brp/flanker-ui/component/helpers";
```

## Input Helpers

Each input helper takes an element (or a group for `watchRadio`), a cell, and an optional `setFromElement` flag.

- `setFromElement = false` (default): the cell value is written to the element first, then the element updates the cell.
- `setFromElement = true`: the element value is written to the cell first. This is useful when the DOM is the source of truth, for example after a server render.

After the initial sync, the binding is two-way.

### `watchInput(element, cell, setFromElement?)`

Works with text inputs and textareas. Listens to `input`.

```typescript
uiHelpers.watchInput(qs("#name"), store.name);
```

### `watchNumber(element, cell, setFromElement?)`

Uses `valueAsNumber` and listens to `input`.

```typescript
uiHelpers.watchNumber(qs("#age"), store.age);
```

### `watchRange(element, cell, setFromElement?)`

Uses `valueAsNumber` and listens to `input`.

```typescript
uiHelpers.watchRange(qs("#volume"), store.volume);
```

### `watchSelect(element, cell, setFromElement?)`

Listens to `change`.

```typescript
uiHelpers.watchSelect(qs("#theme"), store.theme);
```

### `watchCheckbox(element, cell, setFromElement?)`

Binds `checked` and listens to `change`.

```typescript
uiHelpers.watchCheckbox(qs("#notifications"), store.notifications);
```

### `watchRadio(elements, cell, setFromElement?)`

Binds a whole radio group. Accepts an array or a `NodeList`.

```html
<input type="radio" name="plan" value="free">
<input type="radio" name="plan" value="pro">
```

```typescript
uiHelpers.watchRadio(
  document.querySelectorAll("input[name=plan]"),
  store.plan
);
```

The cell stores the `value` of the checked radio. When the cell changes, the matching radio is checked.

## List Helpers

### `renderList(container, items, renderItem, ifEmpty?)`

Renders an array as HTML using `innerHTML`.

```typescript
uiHelpers.renderList(
  qs("#users"),
  users,
  user => `<li>${user.name}</li>`,
  "<li>No users</li>"
);
```

### `renderListNodes(container, items, renderItem, ifEmpty?)`

Same as `renderList`, but each item is an `HTMLElement` and is appended as a node.

```typescript
uiHelpers.renderListNodes(
  qs("#users"),
  users,
  user => {
    const li = document.createElement("li");
    li.textContent = user.name;
    return li;
  },
  "<li>No users</li>"
);
```

`ifEmpty` can be a string or an `HTMLElement`.

### `bindHandlers(root, map, event?)`

Attaches one listener per selector. The default event is `click`.

```typescript
uiHelpers.bindHandlers(qs("#toolbar"), {
  ".save": () => save(),
  ".cancel": () => cancel()
});
```

### `storeHide(element, cell)`

Shows the element when the cell is truthy and hides it otherwise.

```typescript
uiHelpers.storeHide(qs("#spinner"), store.loading);
```

### `htmlToElement(html)`

Turns an HTML string into the first element.

```typescript
const card = uiHelpers.htmlToElement<HTMLDivElement>("<div>Hello</div>");
```

## Helpers and UiView

`UiView` exposes the most common input bindings through the `@bind` decorator, including `range` and `radio`:

```typescript
class SettingsView extends UiView {
  @prop()
  @bind("#volume", "range")
  accessor volume = 0.5;

  @prop()
  @bind("input[name=plan]", "radio")
  accessor plan = "free";
}
```

See [UiView and Decorators](ui-view.md) for the full list of binding types.

## Lifetime

These helpers add listeners and do not remove them. They are meant for elements that live for the whole page, which matches the library target of small pages and applications.
