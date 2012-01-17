/**
 * Standout gallery v0.0.2
 *
 * Copyright 2011, Standout AB, http://standout.se
 * License: MIT
 */
(function($) {
    var Utils = function(opts) {
        var dark;

        var init = function() {
            dark = setDark();
            resizeDark();   
        };

        var setDark = function() {
            var element = $('<canvas/>').appendTo('body');

            if(element[0].getContext) {
                $(window).resize(resizeDark);
            } else {
                element.remove();
                element = $('<div/>').appendTo('body').css({
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000'
                });
            }

            return element.css({
                display: 'none',
                top: 0,
                left: 0,
                zIndex: 10000,
                position: 'fixed',
                opacity: 0
            });
        };

        var resizeDark = function() {
            if(dark[0].getContext) {
                var width = $(window).width();
                var height = $(window).height();
                var ctx = dark[0].getContext('2d');
                dark.attr({width: width, height: height});

                var gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height * 1.3);
                gradient.addColorStop(0, 'rgba(0,0,0,0.25)');
                gradient.addColorStop(1, '#000');

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);
            }
        };

        this.showDark = function() {
            dark.css('display', 'block').animate({opacity: 0.75}, opts.animationSpeed);
        };

        this.hideDark = function() {
            dark.animate({opacity: 0}, opts.animationSpeed, function() {
                dark.css('display', 'none');
            });
        };

        init();
    };
    
    var Gallery = function(opts) {
        var wrapper = $('<div/>').css({
            display: 'none',
            top: 0,
            left: 0,
            zIndex: 10010,
            position: 'fixed'
        }).attr('id', 'gallery_wrapper').appendTo('body');
        var options = $('<div class="options"><div class="left"></div><div class="close"></div><div class="right"></div></div>').css({
            display: 'none',
            opacity: 0
        });
        var title = $('<div/>').addClass('title');
        var triggers = $();
        var images = [];
        var active = false;
        var current, index, optionsTimeout, autoPlayInterval;

        var init = function() {
            wrapper.delegate('div', 'click', function(e) {
                if(e.target == current.copy[0]) {
                    hideImage(next);    
                }

                switch(this.className) {
                    case 'right':
                        hideImage(next);
                        break;
                    case 'left':
                        hideImage(previous);
                        break;
                    case 'close':
                        hide();
                        break;
                }
            });

            opts.parent.delegate(opts.selector, 'click', function(e) {
                e.preventDefault();
                show($(e.currentTarget));
            });

            $(window).resize(resize);
            $(document).keydown(keymap);
            $(document).mousemove(showOptions);
        };

        var show = function(image) {
            active = true;
            index = getIndex(image);
            current = images[index];
            
            if(opts.hideEmbeds) {
                $('iframe, embed, select').css('visibility', 'hidden');
            }

            opts.utils.showDark();
            wrapper.css('display', 'block');
            resizeImage();
            showImage();
        };
        
        var autoShow = function() {
            hideImage(next);
        };

        var hide = function() {
            active = false;

            if(opts.hideEmbeds) {
                $('iframe, embed, select').css('visibility', 'visible');
            }
            
            if(opts.autoPlay) {
                window.clearInterval(autoPlayInterval);
            }

            opts.utils.hideDark();
            wrapper.css('display', 'none');
            hideImage();
        };

        var hideImage = function(callback) {
            if(optionsTimeout) {
                window.clearTimeout(optionsTimeout);

                current.wrapper.children('.options, .title').each(function() {
                    $(this).animate({opacity: 0}, opts.animationSpeed, function() {
                        $(this).remove();
                    });
                });
            }

            if(opts.autoPlay) {
                window.clearInterval(autoPlayInterval);
            }

            current.wrapper.animate({opacity: 0}, opts.animationSpeed, function() {
                current.wrapper.css('display', 'none');
                
                if(callback) {
                    callback();
                }
            });
        };

        var next = function() {
            index = images[index + 1] ? index + 1 : 0;
            current = images[index];
            resizeImage();
            showImage();
        };

        var previous = function() {
            index = images[index - 1] ? index - 1 : images.length - 1;
            current = images[index];
            resizeImage();
            showImage();
        };

        var showImage = function() {
            if(optionsTimeout) {
                window.clearTimeout(optionsTimeout);
            }

            if(opts.autoPlay) {
                autoPlayInterval = window.setInterval(autoShow, 5000);
            }

            current.wrapper.animate({opacity: 1}, opts.animationSpeed);
            current.wrapper.append(options.clone());
            showOptions();

            if(opts.title && current.trigger.attr('title')) {
                current.wrapper.prepend(title.clone().text(current.trigger.attr('title')));
            }
        };

        var resize = function() {
            resizeImage();
        };

        var resizeImage = function() {
            current.wrapper.css('display', 'block');

            if(!current.copy.data('width')) {
                current.copy.data('width', current.copy.width());
                current.copy.data('height', current.copy.height());
            }

            var windowWidth = $(window).width();
            var windowHeight = $(window).height();
            var width = current.copy.data('width');
            var height = current.copy.data('height');

            if(width > windowWidth * opts.maxSize || height > windowHeight * opts.maxSize) {
                width = windowWidth * opts.maxSize;
                height = (current.copy.data('height') / current.copy.data('width')) * width;

                if(height > current.copy.data('height') * opts.maxSize) {
                    height = windowHeight * opts.maxSize;
                    width = (current.copy.data('width') / current.copy.data('height')) * height;
                }
            }

            current.wrapper.css({
                width: width,
                height: height,
                top: (windowHeight - height) * 0.5,
                left: (windowWidth - width) * 0.5
            });

            current.copy.css({
                width: width,
                height: height
            });
        };

        var getIndex = function(element) {
            return triggers.index($(element));
        };

        var keymap = function(e) {
            if(active) {
                switch(e.which) {
                    case 39:
                        hideImage(next);
                        break;
                    case 37:
                        hideImage(previous);
                        break;
                    case 27:
                        hide();
                        break;
                }
            }
        };

        var showOptions = function() {
            if(active) {
                var element = current.wrapper.children('.options');
                
                if(element.is(':hidden')) {
                    element.css('display', 'block').animate({opacity: 1}, opts.animationSpeed); 
                }

                if(optionsTimeout) {
                    window.clearTimeout(optionsTimeout);
                }

                optionsTimeout = window.setTimeout(function() {
                    element.animate({opacity: 0}, opts.animationSpeed, function() {
                        $(this).css('display', 'none');
                    });
                }, 2000);
            }
        };

        var createImage = function(trigger) {
            var image = $('<div><img/></div>').css({
                display: 'none',
                opacity: 0,
                position: 'absolute',
                '-ms-interpolation-mode': 'bicubic'
            }).appendTo(wrapper);

            image.children('img').attr('src', trigger.attr('href'));
            wrapper.append(options);

            return image;
        };

        this.setImage = function(trigger) {
            triggers = triggers.add(trigger);
            var image = createImage(trigger);

            images.push({
                trigger: trigger,
                wrapper: image,
                copy: image.children('img')
            });
        };

        if(!(opts.noMobile && (/mobile/i).test(navigator.userAgent))) {
            init();
        }
    };
    
    $.fn.gallery = function(opts) {
        var utils = new Utils($.extend({
            animationSpeed: 200
        }), opts);

        var gallery = new Gallery($.extend({
            utils: utils,
            maxSize: 0.9,
            animationSpeed: 200,
            parent: this.parent(),
            selector: 'a',
            title: false,
            hideEmbeds: false,
            autoPlay: false,
            noMobile: false
        }, opts));
        
        return this.each(function() {
            gallery.setImage($(this));
        });
    };
})(jQuery);