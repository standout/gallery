# Usage

The usage is quite straight forward. What you need to do is define as many galleries as you want in the DOM, wrap the galleries to a (or several) jQuery object and then call then gallery() method. To set some style on your gallery you could either include the default CSS template or you could write your own.

## HTML

The structure could look something like this:

    <div class='gallery'>
        <a href='/original_image.jpg'><img src='/thumbnail.jpg'></a>
        <a href='/original_image_2.jpg'><img src='/thumbnail_2.jpg'></a>
        <a href='/original_image_3.jpg'><img src='/thumbnail_3.jpg'></a>
    </div>

Class names or the content inside the anchors don't really matters. What's important is that you easily can find the anchors with a selector.

## JavaScript

Include the minified version for production and the unminified for development:

    <script src='/gallery.min.js' type='text/javascript'></script>

When the DOM (or at least the HTML structure of your gallery) is loaded, find the anchors and call the gallery() method on the jQuery object:

    $(document).ready(function() {
        $('.gallery a').gallery();
    });

## CSS

You'll probably want some style on your gallery. Either write your own or include the default CSS template, found in this repository.

    <link href='/gallery.css' rel='stylesheet' type='text/css'>

# How to run the example

In your terminal, type (requires Ruby to be installed on your computer):

    $ cd example
    $ gem install sinatra
    $ rackup

And now, go to localhost:9292.