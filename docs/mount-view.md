# Rendering Reactive Views with `mountView`

The `mountView` function is the core of Flanker UI's component system. It links a data source (like a VQL query), a template, and an HTML element to create a live view.

Define and mount a view:
```typescript
import { mountView } from '@wxn0brp/flanker-ui';

// Assumes an element <div id="user-list"></div> exists in your HTML
const userListView = mountView({
  selector: '#user-list',
  query: 'db users', // VQL query string
  template: (user) => `
    <div class="user-card" data-id="${user.id}">
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <button class="delete-btn">Delete</button>
    </div>
  `,
  events: {
    click: {
      '.delete-btn': (el, event) => {
        const card = el.closest('.user-card');
        const userId = card.dataset.id;
        console.log(`Delete user ${userId}`);
        card.remove();
      }
    }
  }
});

// Initial load
userListView.load();

// You can also reload the view later with new arguments
// userListView.load({ role: 'admin' });
```

## API Reference

### `mountView(options)`

- `selector`: A CSS selector string or an `HTMLElement` to mount the view into.
- `query`: A VQL query string, an object for `fetchVQL`, or a function that returns a VQL query.
- `queryFunction`: An async function `(...args) => Promise<any>` that returns data. Use instead of `query` for custom data fetching.
- `template`: A function `(item: any) => string` that returns an HTML string for each item in the data array.
- `events`: An object for declarative event delegation (e.g., `{ click: { '.my-button': handler } }`).
- `transform`: A function to transform the data after fetching but before sorting and rendering.
- `sort`: A property key (string) or a compare function `(a, b) => number` to sort the data.
- `onData`: A callback function that receives the raw data as soon as it's fetched.
- `onDataTransform`: A callback function that receives the transformed data as soon as it's transformed.
- `onDataSort`: A callback function that receives the sorted data as soon as it's sorted.