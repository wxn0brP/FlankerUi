# DOM Manipulation Extensions

Flanker UI enhances standard `HTMLElement`s with a suite of utility methods for a fluent, jQuery-like experience.

```typescript
import "@wxn0brp/flanker-ui/html"; // Import once to apply extensions

const header = document.createElement("div");
header
  .clA("app-header")
  .css({ padding: "1rem", backgroundColor: "#333", color: "#fff" })
  .html("<h1>Welcome</h1>")
  .on("click", () => alert("Header clicked!"));

document.body.add(header);

header.fadeIn();
```

## API Reference

Importing `'@wxn0brp/flanker-ui/html'` adds the following methods to `HTMLElement.prototype`:

- `.html(content?)`: Get or set `innerHTML`.
- `.v(value?)`: Get or set the `value` of an input, select, or textarea element.
- `.on(event, handler)`: Add an event listener.
- `.css(styles, value?)`: Set CSS styles.
- `.clA(class)`, `.clR(class)`, `.clT(class)`: Add, remove, or toggle a CSS class.
- `.attrib(name, value?)`: Get or set an attribute.
- `.qs(selector)`: Query selectors from the current element.
- `.qs(id, 1)`: Query selectors by data-id.
- `.qi(selector)`: Alias for qs but returns HTMLInputElement.
- `.fadeIn()`, `.fadeOut()`, `.fadeToggle()`: Perform fade animations.
- `.fadeInP()`, `.fadeOutP()`: Promise version.
- `.add(child)`, `.addUp(child)`: Append or prepend a child element.
