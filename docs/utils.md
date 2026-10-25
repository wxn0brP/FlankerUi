# Utilities

General purpose helpers from `src/utils.ts`.

```typescript
import { clamp, delay, escapeHTML } from "@wxn0brp/flanker-ui/utils";
```

The main entry also exposes the whole module as the default export:

```typescript
import utils from "@wxn0brp/flanker-ui";

utils.clamp(0, value, 1);
```

## Numbers

### `rand(min, max)`

Returns a rounded random number between `min` and `max`.

```typescript
rand(1, 10);
```

### `round(number, decimalPlaces)`

Rounds to the given number of decimal places.

```typescript
round(1.2345, 2); // 1.23
```

### `clamp(min, value, max)`

Keeps a value inside a range.

```typescript
clamp(0, value, 1);
```

## Strings

### `escapeHTML(value)`

Escapes `&`, `<`, `>`, `"`, and `'` so a value can be placed in HTML text or an attribute.

```typescript
escapeHTML(`<a href="x">&'`);
// &lt;a href=&quot;x&quot;&gt;&amp;&#39;
```

Use it for every value inserted into a template:

```typescript
template: user => `<strong>${escapeHTML(user.name)}</strong>`;
```

## HTTP

### `getJSON<T>(url)`

Asynchronous JSON fetch. Returns the parsed value, or `null` when the URL is empty, the response is not OK, or the body is empty.

```typescript
const data = await getJSON<{ items: string[] }>("/api/items");

if (data) {
  console.log(data.items);
}
```

Throws if the response body is not valid JSON.

## Timing

### `debounce(func, wait?)`

Runs the function once after `wait` milliseconds without another call. The default is `100`.

```typescript
const search = debounce((query: string) => loadResults(query), 200);
```

### `throttle(func, wait?)`

Runs the function at most once per `wait` milliseconds. The default is `100`.

```typescript
const onScroll = throttle(() => updatePosition(), 50);
```

### `delay(ms)`

Returns a promise that resolves after `ms` milliseconds.

```typescript
await delay(300);
```

## Extraction

### `htmlToElement(html)`

Located in `component/helpers` and also exposed through `uiHelpers`. Turns an HTML string into its first element.

```typescript
import { htmlToElement } from "@wxn0brp/flanker-ui/component/helpers";

const item = htmlToElement<HTMLLIElement>("<li>Hello</li>");
```
