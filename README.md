# Usage

The usage is quite straight forward. What you need to do is define as many galleries as you want in the DOM, wrap the galleries to a (or several) jQuery object and then call the `gallery()` method. To set some style on your gallery you could either include the default CSS template or you could write your own.

## HTML

The structure could look something like this:

```html
<div class='gallery'>
    <a href='/original_image.jpg'><img src='/thumbnail.jpg'></a>
    <a href='/original_image_2.jpg'><img src='/thumbnail_2.jpg'></a>
    <a href='/original_image_3.jpg'><img src='/thumbnail_3.jpg'></a>
</div>
```

Class names or the content inside the anchors don't really matter. What's important is that you easily can find the anchors with a selector.

## JavaScript

Include the minified version for production and the unminified for development:

```html
<script src='/javascripts/gallery.min.js' type='text/javascript'></script>
```

When the DOM (or at least the HTML structure of your gallery) is loaded, find the anchors and call the `gallery()` method on the jQuery object:

```javascript
$(document).ready(function() {
    $('.gallery a').gallery();
});
```

## CSS

You'll probably want some style on your gallery. Either write your own or include the default CSS template, found in the example folder in this repository (don't forget the images).

```html
<link href='/gallery.css' rel='stylesheet' type='text/css'>
```

## Options

When calling the gallery() method you can pass the following options.

* `maxSize` (0.9) - Maximum size of the images when they are showed, in relation to the viewport.
* `animationSpeed` (200) - How long all the animations are running (in milliseconds).
* `title` (false) - Show a title on the images if the `<a>` has a title attribute.
* `hideEmbeds` (false) - Hide flash and other elements which may have higher z-index than the gallery.
* `autoPlay` (false) - Automatically loop through the gallery, switching images every five seconds.
* `noMobile` (false) - If set to true, the gallery will have no support for mobile devices (links will simply redirect the user to the images).

### Example

```javascript
$(function() {
    $('.gallery a').gallery({
        maxSize: 0.5,
        title: true,
        autoPlay: true
    });
});
```