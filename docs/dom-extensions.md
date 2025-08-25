# DOM Manipulation Extensions

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

## API Reference

Importing `'@wxn0brp/flanker-ui/html'` adds the following methods to `HTMLElement.prototype`:

- `.html(content?)`: Get or set `innerHTML`.
- `.v(value?)`: Get or set the `value` of an input, select, or textarea element.
- `.on(event, handler)`: Add an event listener.
- `.css(styles, value?)`: Set CSS styles.
- `.clA(class)`, `.clR(class)`, `.clT(class)`: Add, remove, or toggle a CSS class.
- `.qs(selector)`, `.qsi(selector)`: Query selectors for descendants.
- `.qi(id)`, `.qii(id)`: Query selectors by data-id.
- `.fadeIn()`, `.fadeOut()`, `.fadeToggle()`: Perform fade animations.
- `.fadeInP()`, `.fadeOutP()`: Promise version.
- `.add(child)`, `.addUp(child)`: Append or prepend a child element.