# Rendering Views with `mountView`

`mountView` connects a data loader, a template, and a target element. It can use VQL through `query`, or any async data source through `queryFunction`.

```typescript
import { mountView } from "@wxn0brp/flanker-ui";

const users = [
  { id: 1, name: "Ada", role: "admin" },
  { id: 2, name: "Lin", role: "editor" }
];

const userListView = mountView({
  selector: "#user-list",
  queryFunction: async (_assignArgs, args) => {
    return users.filter(user => !args.role || user.role === args.role);
  },
  sort: "name",
  emptyData: '<p class="empty">No users found.</p>',
  template: user => `
    <article class="user-card" data-id="${user.id}">
      <strong>${user.name}</strong>
      <span>${user.role}</span>
      <button class="delete-btn">Delete</button>
    </article>
  `,
  events: {
    click: {
      ".delete-btn": (el) => {
        const card = el.closest(".user-card");
        console.log("Delete user", card.dataset.id);
      }
    }
  },
  onLoading: (loading) => {
    document.querySelector("#loader").hidden = !loading;
  },
  onError: (error) => {
    console.error("Could not load users", error);
  }
});

userListView.load();
userListView.load({ role: "admin" });
```

## API Reference

### `mountView(options)`

- `selector`: A CSS selector string or an `HTMLElement` to mount the view into.
- `query`: A VQL query string, an object for `fetchVQL`, or a function that returns a VQL query.
- `queryFunction`: An async function `(assignArgs, args) => Promise<any>` that returns data. Use instead of `query` for custom data fetching.
- `queryArgs`: Default arguments merged into `assignArgs`.
- `template`: A function `(item: any) => string` that returns an HTML string for each item in the data array.
- `events`: An object for declarative event delegation (e.g., `{ click: { '.my-button': handler } }`).
- `transform`: A function to transform the data after fetching but before sorting and rendering.
- `sort`: A property key (string) or a compare function `(a, b) => number` to sort the data.
- `emptyData`: HTML rendered when the loaded data is empty.
- `templateDataMode`: `"replace"`, `"append"`, or `"prepend"`.
- `onData`: A callback function that receives the raw data as soon as it's fetched.
- `onDataTransform`: A callback function that receives the transformed data as soon as it's transformed.
- `onDataSort`: A callback function that receives the sorted data as soon as it's sorted.
- `onLoading`: Called with `true` when a load starts and `false` when the latest load finishes.
- `onError`: Called when fetching, transforming, sorting, or rendering throws. If omitted, `load()` rethrows the error.

The returned view exposes:

- `element`: The mounted element.
- `mount()`: Runs `load()`.
- `load(args?)`: Fetch, transform, sort, and render data.
- `render(data, mode?)`: Render data directly without fetching.

## Loading and Errors

`onLoading` wraps every `load()` call. When several loads overlap, only the latest one controls the `false` callback.

```typescript
const view = mountView({
  selector: "#list",
  queryFunction: fetchItems,
  template: item => `<li>${item.name}</li>`,
  onLoading: loading => {
    loader.hidden = !loading;
  },
  onError: error => {
    message.textContent = "Load failed";
    console.error(error);
  }
});

view.mount();
```

Without `onError`, the error is rethrown, so you can handle it with `try/catch` or `.catch()`:

```typescript
view.load().catch(error => {
  console.error(error);
});
```

## Concurrent Loads

Only the latest `load()` renders. If an older request finishes after a newer one, its result is ignored, so the view never shows stale data from an outdated call.

```typescript
view.load({ role: "admin" });
view.load({ role: "editor" });
// the second response is rendered, the first one is discarded
```

## Sorting

`sort` sorts the array in place. This is safe for data returned from network requests, but query functions that return a shared array should return a copy.

```typescript
queryFunction: async () => [ ...sharedItems ]
```

## Events

Event handlers are delegated and attached once, when `mountView()` is called. They keep working after `render()` replaces the content.

```typescript
events: {
  click: {
    ".delete-btn": (element, event) => {
      console.log("delete", element.dataset.id);
    }
  }
}
```
