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
    if (!args.role) return users;
    return users.filter(user => user.role === args.role);
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

The returned view exposes:

- `element`: The mounted element.
- `load(args?)`: Fetch, transform, sort, and render data.
- `render(data, mode?)`: Render data directly without fetching.

See `examples/mount-view-tasks.html` for a complete browser example.
