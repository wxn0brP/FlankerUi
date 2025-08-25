# State Management with `createStore`

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