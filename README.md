# Usage

The usage is quite straight forward. What you need to do is define as many galleries as you want in the DOM, wrap the galleries to a (or several) jQuery object and then call then gallery() method. To set some style on your gallery you could either include the default CSS template or you could write your own.

## HTML

The structure should look like this:

    <div class='gallery'>
        <a href='/original_image.jpg'><img src='/thumbnail.jpg'></a>
        <a href='/original_image_2.jpg'><img src='/thumbnail_2.jpg'></a>
        <a href='/original_image_3.jpg'><img src='/thumbnail_3.jpg'></a>
    </div>

* The id or class of the wrapper (in this case the class name is "gallery") could be anything you want.
* The anchor elements should link to the images you want to show when the gallery is active (usually a bigger version).
* The image elements should contain the listed images (usually thumbnails).

## JavaScript

Include the minified version for production and the unminified for development:

    <script src='/gallery.min.js' type='text/javascript'></script>

When the DOM (or at least the HTML structure of your gallery) is loaded, find the gallery wrapper and call the gallery() method:

    $(document).ready(function() {
        $('.gallery').ready();
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