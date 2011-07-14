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
		var images = [];
		var current;
		var active = false;
		var optionsTimeout;

		var init = function() {
			setImages();

			wrapper.delegate('div', 'click', function() {
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

			opts.element.delegate('a', 'click', function() {
				show(getImage(this));
				return false;
			});

			$(window).resize(resize);
			$(window).keydown(keymap);
			$(window).mousemove(showOptions);
		};

		var show = function(image) {
			active = true;
			current = image;
			Utils.showDark();
			wrapper.css('display', 'block');
			resizeImage();
			showImage();	
		};

		var hide = function() {
			active = false;
			Utils.hideDark();
			wrapper.css('display', 'none');
			hideImage();
		};

		var hideImage = function(callback) {
			if(optionsTimeout) {
				window.clearTimeout(optionsTimeout);

				current.wrapper.children('.options').animate({opacity: 0}, opts.animationSpeed, function() {
					$(this).css('display', 'none');
				});
			}

			current.wrapper.animate({opacity: 0}, opts.animationSpeed, function() {
				current.wrapper.css('display', 'none');
				
				if(callback) {
					callback();
				}
			});
		};

		var next = function() {
			var image = current.trigger.next().length ? current.trigger.next() : opts.element.children('a').eq(0);
			current = getImage(image);
			resizeImage();
			showImage();
		};

		var previous = function() {
			var index = opts.element.children('a').index(current.trigger);
			current = index - 1 < 0 ? images[images.length - 1] : images[index - 1];
			resizeImage();
			showImage();
		};

		var showImage = function() {
			if(optionsTimeout) {
				window.clearTimeout(optionsTimeout);
			}

			current.wrapper.animate({opacity: 1}, opts.animationSpeed);
			current.wrapper.append(options);
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

		var getImage = function(element) {
			return images[opts.element.children('a').index($(element))];
		};

		var setImages = function() {
			opts.element.children('a').each(function() {
				var image = createImage($(this));

				images.push({
					trigger: $(this),
					wrapper: image,
					copy: image.children('img')
				});
			});
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

		init();
	};
	
	$.fn.gallery = function(opts) {
		Utils = new Utils($.extend({
			animationSpeed: 200
		}), opts);
		
		return this.each(function() {
			new Gallery($.extend({
				element: $(this),
				maxSize: 0.9,
				animationSpeed: 200
			}, opts));
		});
	};
})(jQuery);