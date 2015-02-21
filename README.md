# Lazy Load [![NPM version](https://badge.fury.io/js/lazy-load.png)](https://www.npmjs.com/package/lazy-load)

> Efficient and small, load your images lazily without messy jQuery plugins.

## Required DOM Structure
```html
<img src="/baz.png"> <!-- will not be lazy loaded -->
<img class="lazy-load" data-src="/foo.png">
<img class="lazy-load" data-src="/bar.png">
```

## Initialization
```js
lazyLoad.init( imageSelector, imageSourceAttribute );
```
Initializes lazy load. Can optionally pass in:

### `imageSelector`
The class representing the image/images that you would like to lazy load ( `.lazy-load` by default ).

### `imageSourceAttribute`
Attribute on the image element that holds the image source ( `data-src` by default ).
