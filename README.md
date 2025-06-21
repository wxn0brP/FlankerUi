# Flanker UI

Flanker UI is a lightweight, reactive UI framework for building dynamic web applications with TypeScript. It provides a simple yet powerful set of tools for state management, DOM manipulation, and component-based rendering.

## Features

- **Reactive Views**: Use `mountView` to create data-driven components that automatically update.
- **Centralized State Management**: A simple, powerful `createStore` function for reactive state that can be shared across your application.
- **Fluent DOM API**: Adds convenient helper methods directly to `HTMLElement` prototypes for cleaner, more readable DOM manipulation.
- **VQL Integration**: Natively supports fetching data using [VQL (View Query Language)](https://github.com/wxn0brp/VQL).
- **Event Delegation**: A declarative, efficient event handling system for dynamic content.
- **Standalone Modules**: Core functionalities like DOM extensions can be used independently.

## Installation

Install the package via npm or yarn:

```bash
npm install @wxn0brp/flanker-ui
```
or
```bash
yarn add @wxn0brp/flanker-ui
```

## Usage

### 1. State Management with `createStore`

Create a reactive store to manage your application's state. Components can subscribe to changes and update automatically.

```typescript
import { createStore } from '@wxn0brp/flanker-ui';

// Define a schema for your store
const appStore = createStore({
  isAuthenticated: false,
  user: {
    name: 'Guest',
    theme: 'dark'
  },
  counter: 0
});

// Subscribe to changes in a specific state property
appStore.counter.subscribe((newValue) => {
  console.log('Counter changed to:', newValue);
});

// Update a value
appStore.counter.set(1); // Logs: "Counter changed to: 1"

// Nested properties are also reactive
appStore.user.name.set('Alice');
```

### 2. DOM Manipulation Extensions

Flanker UI enhances standard `HTMLElement`s with a suite of utility methods for a fluent, jQuery-like experience.

```typescript
import '@wxn0brp/flanker-ui/html'; // Import to apply extensions

// Create and manipulate elements with a clean, chainable API
const header = document.createElement('div');
header
  .clA('app-header')         // Add class 'app-header'
  .css({ padding: '1rem', backgroundColor: '#333' }) // Set styles
  .html('<h1>Welcome</h1>')  // Set inner HTML
  .on('click', () => alert('Header clicked!')); // Add event listener

document.body.querySelector('header').add(header); // Append to body (custom 'add' method)

// Animate elements
header.fadeIn(); // Fades the element in
```

### 3. Rendering Reactive Views with `mountView`

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

### DOM Extensions (`html.ts`)

Importing `'@wxn0brp/flanker-ui/html'` adds the following methods to `HTMLElement.prototype`:

- `.html(content?)`: Get or set `innerHTML`.
- `.v(value?)`: Get or set the `value` of an input, select, or textarea element.
- `.on(event, handler)`: Add an event listener.
- `.css(styles, value?)`: Set CSS styles.
- `.clA(class)`, `.clR(class)`, `.clT(class)`: Add, remove, or toggle a CSS class.
- `.qs(selector)`, `.qsi(selector)`: Query selectors for descendants.
- `.qi(id)`, `.qii(id)`: Query selectors by data-id.
- `.fadeIn()`, `.fadeOut()`, `.fadeToggle()`: Perform fade animations.
- `.add(child)`, `.addUp(child)`: Append or prepend a child element.

### Standalone `me.ts`

The `me()` function provides a simple way to get a reference to an element relative to the current `<script>` tag, useful for self-contained web components.

```html
<div>
  <p>Parent of script</p>
  <script type="module">
    import '@wxn0brp/flanker-ui/me';
    const div = me(); // Returns the parent <div>
    div.style.border = "1px solid red";
  </script>
</div>
```

## Contributing

Contributions are welcome! Fork the repository and create a new Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).