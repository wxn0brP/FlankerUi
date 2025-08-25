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

Use `data-r` attributes on HTML elements to define reactive bindings:

```html
<!-- Format: path:type:attrName[:expr] -->
<div data-r="user.name:attr:textContent"></div>
```

## Attribute Binding

Update HTML attributes based on store values:

```html
<!-- Enable/disable button -->
<button data-r="user.isActive:attr:disabled:!v">Edit Profile</button>

<!-- Set image source -->
<img data-r="user.avatar:attr:src" />

<!-- Set input placeholder -->
<input data-r="user.name:attr:placeholder:'Enter name for ' + v" />
```

## Style Binding

Update CSS styles directly from store values:

```html
<!-- Background color based on theme -->
<div data-r="theme:style:backgroundColor:v === 'dark' ? '#333' : '#fff'">Content</div>

<!-- Width based on percentage -->
<div data-r="counter:style:width:(v * 10) + '%'">Progress</div>

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
<div data-r="theme:style:backgroundColor:v === 'dark' ? '#333' : '#fff', theme:style:color:v === 'dark' ? '#fff' : '#333'">
  Content
</div>
```

## Base Keys

Use `data-base-key` to simplify paths:

```html
<div data-base-key="user">
  <!-- Binds to user.name -->
  <span data-r="name:attr:textContent"></span>
  
  <!-- Binds to user.isActive -->
  <button data-r="isActive:attr:disabled:!v">Edit</button>
</div>
```

## Expression Syntax

Expressions are JavaScript code that receive the store value as `v`:

- `!v` - Inverts a boolean value
- `v === 'value'` - Compare with a string
- `(v * 100) + '%'` - Transform a number to a percentage
- `'Prefix ' + v` - Concatenate strings
- `v > 10 ? 'high' : 'low'` - Conditional values