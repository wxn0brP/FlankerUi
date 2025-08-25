# Standalone Modules

## Standalone `me.ts`

The `me()` function provides a simple way to get a reference to an element relative to the current `<script>` tag, useful for self-contained web components.

```html
<script src="@wxn0brp/flanker-ui/me"></script>
<div>
  <p>Parent of script</p>
  <script>
    const div = me(); // Returns the parent <div>
    div.style.border = "1px solid red";
  </script>
</div>
```