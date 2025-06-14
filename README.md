# Flanker UI Framework

A lightweight, reactive UI framework for building dynamic web applications with TypeScript.

## Features
- **Reactive Components**: Build encapsulated components with lifecycle hooks
- **Template Engine**: Advanced templating with `{{mustache}}` syntax support
- **State Management**: Built-in reactive store system
- **DOM Utilities**: Extended HTMLElement methods for common operations
- **Event Handling**: Declarative event binding system
- **Component Composition**: Mixin-based architecture for flexible UI development
- **VQL Integration**: Query and fetch data using [VQL](https://github.com/wxn0brp/VQL)

## Installation
```bash
yarn add github:wxn0brP/FlankerUi#dist
```

## Basic Usage

### State Management
```ts
import { createStore } from '@wxn0brp/flanker-ui';

const appStore = createStore({
  counter: 0,
  user: {
    name: 'John Doe',
    isLoggedIn: false
  }
});

// Subscribe to changes
appStore.counter.subscribe((newValue) => {
  console.log('Counter updated:', newValue);
});

// Update state
appStore.counter.set(1);
```

### DOM Manipulation
```ts
// Create and manipulate elements
const element = document.createElement('div');
element
  .clA('my-class')             // Add class
  .css({ color: 'red' })       // Set styles
  .html('<p>Hello World</p>'); // Set inner HTML

// Animation
element.fadeIn();
element.animateFade(0, { time: 500 });
```

### VQL Integration
```ts
import { componentVars } from "@wxn0brp/flanker-ui";
import { fetchVQL } from "@wxn0brp/vql-client";
componentVars.fetchVQL = fetchVQL; // or other vql client implementation
```

## API Reference

### DOM Extensions
All HTMLElements have these additional methods:
- `.html()` - Get/set inner HTML
- `.v()` - Get/set input value
- `.css()` - Manipulate styles
- `.clA/clR/clT()` - Class manipulation
- `.fadeIn/fadeOut/fadeToggle()` - Animation methods
- `.on()` - Event listener registration

## Independent Files
- [`@wxn0brp/flanker-ui/html.js`](https://github.com/wxn0brP/FlankerUi/blob/master/src/html.ts) <- to html,v,css,on,etc
- [`@wxn0brp/flanker-ui/me.js`](https://github.com/wxn0brP/FlankerUi/blob/master/src/me.ts)

## License
MIT License

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Credits
Built with TypeScript, leveraging modern web APIs for reactive programming.