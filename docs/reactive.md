# Reactive HTML Binding

The reactive system in Flanker UI allows you to bind HTML element properties to your application state using special `data-r` attributes.

## Setup

To use reactive HTML binding, initialize it with your store:

```typescript
import { initReactiveHTML } from '@wxn0brp/flanker-ui/reactive';
import { createStore } from '@wxn0brp/flanker-ui';

const store = createStore({
  user: {
    name: 'John',
    isActive: true
  },
  theme: 'dark',
  counter: 0
});

initReactiveHTML(store);
```

## Basic Syntax

Use `data-r`, `data-r-0`, `data-r-1` attributes on HTML elements to define reactive bindings:

```html
<!-- Format: path:type:attrName[:expr] -->
<div data-r="user.name:textContent"></div>
```

For `textContent` and `innerHTML`, the `attrName` part is ignored but still required:

```html
<!-- For textContent and innerHTML, attrName is ignored but must be present -->
<div data-r="user.name:textContent"></div>
```

The available types are:
- `attr` - for HTML attributes
- `style` - for CSS styles
- `class` - for CSS classes
- `textContent` - for text content
- `innerHTML` - for HTML content

When no type is specified, it defaults to `style`. However, for explicit clarity, it's recommended to always specify the type:

```html
<!-- This binds to the backgroundColor style property -->
<div data-r="theme:style:backgroundColor:v === 'dark' ? '#333' : '#fff'"></div>
```

The format is `path:type:attrName[:expr]` where:
- `path` is the path to the value in the store
- `type` is the binding type (`attr`, `style`, `class`, `textContent`, or `innerHTML`)
- `attrName` is the attribute name, style property, or class name to bind to (required but ignored for `textContent` and `innerHTML`)
- `expr` is an optional JavaScript expression that transforms the value (receives the store value as `v`)

## Attribute Binding

Update HTML attributes based on store values:

```html
<!-- Enable/disable button -->
<button data-r="user.isActive:attr:disabled:!v">Edit Profile</button>

<!-- Set image source -->
<img data-r="user.avatar:attr:src" />
```

## Style Binding

Update CSS styles directly from store values:

```html
<!-- Background color based on theme -->
<div data-r="theme:style:backgroundColor:v === 'dark' ? '#333' : '#fff'">Content</div>

<!-- Multiple styles -->
<div data-r="theme:style:backgroundColor:v === 'dark' ? '#333' : '#fff', theme:style:color:v === 'dark' ? '#fff' : '#333'">
  Content
</div>
```

## Class Binding

Add or remove CSS classes based on boolean values:

```html
<!-- Add 'active' class when user.isActive is true -->
<div data-r="user.isActive:class:active">Profile</div>

<!-- Add 'hidden' class when user.isVisible is false -->
<div data-r="user.isVisible:class:hidden:!v">Secret Content</div>
```

## Multiple Bindings

Separate multiple bindings with commas:

```html
<!-- Update both disabled state and class -->
<input data-r="isLoading:attr:disabled:v, isLoading:class:loading" />

<!-- Multiple style properties -->
<div 
  data-r-0="theme:style:backgroundColor:v === 'dark' ? '#333' : '#fff'"
  data-r-1="theme:style:color:v === 'dark' ? '#fff' : '#333'">
  Content
</div>
```

## Base Keys

Use `data-base-key` to simplify paths:

```html
<!-- Binds to user.name -->
<span data-base-key="user" data-r="name:textContent"></span>
  
<!-- Binds to user.isActive -->
<button data-base-key="user" data-r="isActive:attr:disabled:!v">Edit</button>
```

## Expression Syntax

Expressions are JavaScript code that receive the store value as `v` (JS Statement):

- `!` - Inverts a boolean value
- `v === 'value'` - Compare with a string
- `v > 10 ? 'high' : 'low'` - Conditional values