# scrollbackHeader

scrollbackHeader creates a non-stupid-behaving semi-sticky top header, that sticks
to the top when needed, and scrolls away when not needed. Simple!

Created long ago, around 2014, in the early days of headers triggered by scroll events, when headers animated themselves in on the slightest scroll upwards, and placed themselves above the text you were trying to read. Strangely, they still do, all over the internets. Please people, use this method instead!

Returns a `destroy` function to call at cleanup.

#### Demo:

https://codepen.io/smlsvnssn/full/QWKZqYm

#### Params:

-   **element (required)**, an instance of `Element` that the effect will apply to.
-   **sideeffect**, an optional `Function` that applies any desired sideeffect. Function is called with parameters `element` and `renderstate`. Renderstate can be either `"absolute"` (element follows page scroll), `"scrollback"` (element scrolls back into view) or `"fixed"` (element sticks to top). Example here: https://codepen.io/smlsvnssn/pen/JjWNLMB and https://codepen.io/smlsvnssn/pen/RwGqWMZ
-   **thresholdUp**, a threshold value for activating the scrollback effect, scrolling the element back in or out of view. Defaults to 5 px/animationframe.
-   **thresholdDown**, defaults to the same value as `thresholdUp`.

#### Usage:

Vanilla:

```JavaScript

import withScrollback from 'scrollbackheader'

destroySB = withScrollback(document.querySelector('header'));

```

As a svelte action:

```html
<script>
	import withScrollback from 'scrollbackheader'
</script>

<div class="header" use:withScrollback>Hello scrollbackheader!</div>
```
