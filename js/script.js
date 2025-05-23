"use strict";
(function () {
	// Global variables
	let
		userAgent = navigator.userAgent.toLowerCase(),
		isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false;

	// Unsupported browsers
	if (isIE !== false && isIE < 12) {
		console.warn("[Core] detected IE" + isIE + ", load alert");
		var script = document.createElement("script");
		script.src = "./js/support.js";
		document.querySelector("head").appendChild(script);
	}

	let
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),
    $body = $("body"),

    isDesktop = $html.hasClass("desktop"),
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isNoviBuilder = window.xMode,
    windowReady = false,
    isTouch = "ontouchstart" in window,

    plugins = {
      bootstrapAccordion:      $(".accordion-group-custom"),
      bootstrapTooltip:        $("[data-bs-toggle='tooltip']"),
      bootstrapTabs:           $('.tabs-custom'),
      bootstrapModal:          $('.modal'),
      materialParallax:        $(".parallax-container"),
      rdAudioPlayer:           $(".rd-audio"),
      rdVideoPlayer:           $(".rd-video-player"),
      maps:                    $('.google-map-container'),
      rdNavbar:                $(".rd-navbar"),
      preloader:               $('.preloader'),
      filePicker:              $('.rd-file-picker'),
      fileDrop:                $('.rd-file-drop'),
      vide:                    $('.bg-vide'),
      stepper:                 $("input[type='number']"),
      toggles:                 $(".toggle-custom"),
      facebookplugin:          $('#fb-root'),
      textRotator:             $(".text-rotator"),
      demonstration:           $(".rd-navbar-iframe-demonstration iframe"),
      owl:                     $(".owl-carousel"),
      swiper:                  $('.swiper-container'),
      copyrightYear:           $('.copyright-year'),
      lightGallery:            $('[data-lightgallery="group"]'),
      lightGalleryItem:        $('[data-lightgallery="item"]'),
      lightDynamicGalleryItem: $('[data-lightgallery="dynamic"]'),
      twitterfeed:             $(".twitter"),
      slick:                   $('.slick-slider'),
      isotope:                 $('.isotope-wrap'),
      stacktable:              $("table[data-responsive='true']"),
      customToggle:            $("[data-custom-toggle]"),
      customWaypoints:         $('[data-custom-scroll-to]'),
      resizable:               $(".resizable"),
      selectFilter:            $("select"),
      calendar:                $(".rd-calendar"),
      productThumb:            $(".product-thumbnails"),
      imgZoom:                 $(".img-zoom"),
      facebookfeed:            $(".facebook"),
      pageLoader:              $(".page-loader"),
      search:                  $(".rd-search"),
      searchResults:           $('.rd-search-results'),
      instafeed:               $(".instafeed"),
      iframeEmbed:             $("iframe.embed-responsive-item"),
      bootstrapDateTimePicker: $("[date-time-picker]"),
      checkoutRDTabs:          $(".checkout-tabs"),
      galleryRDTabs:           $(".gallery-tabs"),
      rdMailForm:              $(".rd-mailform"),
      rdInputLabel:            $(".form-label"),
      regula:                  $("[data-constraints]"),
      radio:                   $("input[type='radio']"),
      checkbox:                $("input[type='checkbox']"),
      captcha:                 $('.recaptcha'),
      mailchimp:               $('.mailchimp-mailform'),
      campaignMonitor:         $('.campaign-mailform'),
	    countdown:               document.querySelectorAll('.countdown'),
      progressLinear:          document.querySelectorAll('.progress-linear:not(.progress-linear-bs)'),
      progressCircle:          document.querySelectorAll('.progress-circle'),
      counter:                 document.querySelectorAll(".counter"),
    };

  /**
   * @desc Check the element has been scrolled into the view
   * @param {object} elem - jQuery object
   * @return {boolean}
   */
  function isScrolledIntoView(elem) {
    if (isNoviBuilder) return true;
    return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
  }

  /**
   * @desc Calls a function when element has been scrolled into the view
   * @param {object} element - jQuery object
   * @param {function} func - init function
   */
  function lazyInit(element, func) {
    var scrollHandler = function () {
      if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
        func.call();
        element.addClass('lazy-loaded');
      }
    };

    scrollHandler();
    $window.on('scroll', scrollHandler);
  }

  $window.on('load', function () {
    if (plugins.preloader.length && !isNoviBuilder) {
      pageTransition({
        target: document.querySelector('.page'),
        delay: 0,
        duration: 500,
        classIn: 'fadeIn',
        classOut: 'fadeOut',
        classActive: 'animated',
        conditions: function (event, link) {
          return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
        },
        onTransitionStart: function (options) {
          setTimeout(function () {
            plugins.preloader.removeClass('loaded');
          }, options.duration * .75);
        },
        onReady: function () {
          plugins.preloader.addClass('loaded');
          windowReady = true;
        }
      });
    }

    // Isotope
    if (plugins.isotope.length) {
      for (var i = 0; i < plugins.isotope.length; i++) {
        var
          wrap = plugins.isotope[i],
          filterHandler = function (event) {
            event.preventDefault();
            for (var n = 0; n < this.isoGroup.filters.length; n++) this.isoGroup.filters[n].classList.remove('active');
            this.classList.add('active');
            this.isoGroup.isotope.arrange({filter: this.getAttribute("data-isotope-filter") !== '*' ? '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]' : '*'});
          },
          resizeHandler = function () {
            this.isoGroup.isotope.layout();
          };

        wrap.isoGroup = {};
        wrap.isoGroup.filters = wrap.querySelectorAll('[data-isotope-filter]');
        wrap.isoGroup.node = wrap.querySelector('.isotope');
        wrap.isoGroup.layout = wrap.isoGroup.node.getAttribute('data-isotope-layout') ? wrap.isoGroup.node.getAttribute('data-isotope-layout') : 'masonry';
        wrap.isoGroup.isotope = new Isotope(wrap.isoGroup.node, {
          itemSelector: '.isotope-item',
          layoutMode: wrap.isoGroup.layout,
          filter: '*',
          columnWidth: (function () {
            if (wrap.isoGroup.node.hasAttribute('data-column-class')) return wrap.isoGroup.node.getAttribute('data-column-class');
            if (wrap.isoGroup.node.hasAttribute('data-column-width')) return parseFloat(wrap.isoGroup.node.getAttribute('data-column-width'));
          }())
        });

        for (var n = 0; n < wrap.isoGroup.filters.length; n++) {
          var filter = wrap.isoGroup.filters[n];
          filter.isoGroup = wrap.isoGroup;
          filter.addEventListener('click', filterHandler);
        }

        window.addEventListener('resize', resizeHandler.bind(wrap));
      }
    }

    // Counter
    if (plugins.counter) {
      for (let i = 0; i < plugins.counter.length; i++) {
        let
          node = plugins.counter[i],
          counter = aCounter({
            node:     node,
            duration: node.getAttribute('data-duration') || 1000
          }),
          scrollHandler = (function () {
            if (Util.inViewport(this) && !this.classList.contains('animated-first')) {
              this.counter.run();
              this.classList.add('animated-first');
            }
          }).bind(node),
          blurHandler = (function () {
            this.counter.params.to = parseInt(this.textContent, 10);
            this.counter.run();
          }).bind(node);

        if (isNoviBuilder) {
          node.counter.run();
          node.addEventListener('blur', blurHandler);
        } else {
          scrollHandler();
          window.addEventListener('scroll', scrollHandler);
        }
      }
    }

    // Progress bar
    if (plugins.progressLinear) {
      for (let i = 0; i < plugins.progressLinear.length; i++) {
        let
          container = plugins.progressLinear[i],
          duration = container.getAttribute('data-duration') || 1000,
          bar =  container.querySelector('.progress-bar-linear'),
          counter = aCounter({
            node:     container.querySelector('.progress-value'),
            duration,
            onStart:  function () {
              this.custom.bar.style.width = this.params.to + '%';
            }
          });

        bar.style.transitionDuration = duration / 1000 + 's';
        counter.custom = {
          container,
          bar,
          onScroll:  (function () {
            if ((Util.inViewport(this.custom.container) && !this.custom.container.classList.contains('animated')) || isNoviBuilder) {
              this.run();
              this.custom.container.classList.add('animated');
            }
          }).bind(counter),
          onBlur:    (function () {
            this.params.to = parseInt(this.params.node.textContent, 10);
            this.run();
          }).bind(counter)
        };

        if (isNoviBuilder) {
          counter.run();
          counter.params.node.addEventListener('blur', counter.custom.onBlur);
        } else {
          counter.custom.onScroll();
          document.addEventListener('scroll', counter.custom.onScroll);
        }
      }
    }

    // Progress Circle
    if (plugins.progressCircle) {
      for (let i = 0; i < plugins.progressCircle.length; i++) {
        let
          container = plugins.progressCircle[i],
          duration = container.getAttribute('data-duration') || 500,
          bar = container.querySelector('.progress-circle-bar'),
          counter = aCounter({
            node:     container.querySelector('.progress-circle-counter'),
            duration,
            onUpdate: function (value) {
              this.custom.bar.render(value * 3.6);
            }
          });

        bar.style.transitionDuration = duration / 1000 + 's';
        counter.params.onComplete = counter.params.onUpdate;

        counter.custom = {
          container: container,
          bar:       aProgressCircle({node: bar}),
          onScroll:  (function () {
            if (Util.inViewport(this.custom.container) && !this.custom.container.classList.contains('animated')) {
              this.run();
              this.custom.container.classList.add('animated');
            }
          }).bind(counter),
          onBlur:    (function () {
            this.params.to = parseInt(this.params.node.textContent, 10);
            this.run();
          }).bind(counter)
        };

        if (isNoviBuilder) {
          counter.run();
          counter.params.node.addEventListener('blur', counter.custom.onBlur);
        } else {
          counter.custom.onScroll();
          window.addEventListener('scroll', counter.custom.onScroll);
        }
      }
    }

    // Material Parallax
    if (plugins.materialParallax.length) {
      if (!isNoviBuilder && !isIE && !isMobile) {
        plugins.materialParallax.parallax();
      } else {
        for (var i = 0; i < plugins.materialParallax.length; i++) {
          var $parallax = $(plugins.materialParallax[i]);

          $parallax.addClass('parallax-disabled');
          $parallax.css({"background-image": 'url(' + $parallax.data("parallax-img") + ')'});
        }
      }
    }
  });

  // Initialize scripts that require a finished document
  $(function () {

    /**
     * Wrapper to eliminate json errors
     * @param {string} str - JSON string
     * @returns {object} - parsed or empty object
     */
    function parseJSON ( str ) {
      try {
        if ( str )  return JSON.parse( str );
        else return {};
      } catch ( error ) {
        console.warn( error );
        return {};
      }
    }

    /**
     * getSwiperHeight
     * @description  calculate the height of swiper slider basing on data attr
     */
    function getSwiperHeight(object, attr) {
      var val = object.attr("data-" + attr),
        dim;
      if (!val) {
        return undefined;
      }

      dim = val.match(/(px)|(%)|(vh)$/i);

      if (dim.length) {
        switch (dim[0]) {
          case "px":
            return parseFloat(val);
          case "vh":
            return $(window).height() * (parseFloat(val) / 100);
          case "%":
            return object.width() * (parseFloat(val) / 100);
        }
      } else {
        return undefined;
      }
    }


    /**
     * @desc Sets slides background images from attribute 'data-slide-bg'
     * @param {object} swiper - swiper instance
     */
    function setBackgrounds(swiper) {
      let swipersBg = swiper.el.querySelectorAll('[data-slide-bg]');

      for (let i = 0; i < swipersBg.length; i++) {
        let swiperBg = swipersBg[i];
        swiperBg.style.backgroundImage = 'url(' + swiperBg.getAttribute('data-slide-bg') + ')';
      }
    }

    /**
     * toggleSwiperCaptionAnimation
     * @description  toggle swiper animations on active slides
     */
    function toggleSwiperCaptionAnimation(swiper) {
      let prevSlide = $(swiper.$el[0]),
        nextSlide = $(swiper.slides[swiper.activeIndex]);

      prevSlide
        .find("[data-caption-animate]")
        .each(function () {
          let $this = $(this);
          $this
            .removeClass("animated")
            .removeClass($this.attr("data-caption-animate"))
            .addClass("not-animated");
        });

      nextSlide
        .find("[data-caption-animate]")
        .each(function () {
          let $this = $(this),
            delay = $this.attr("data-caption-delay");


          if (!isNoviBuilder) {
            setTimeout(function () {
              $this
                .removeClass("not-animated")
                .addClass($this.attr("data-caption-animate"))
                .addClass("animated");
            }, delay ? parseInt(delay) : 0);
          } else {
            $this
              .removeClass("not-animated")
          }
        });
    }


    /**
     * @desc Initialize owl carousel plugin
     * @param {object} c - carousel jQuery object
     */
    function initOwlCarousel(c) {
      var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
        values = [0, 576, 768, 992, 1200, 1600],
        responsive = {};

      for (var j = 0; j < values.length; j++) {
        responsive[values[j]] = {};
        for (var k = j; k >= -1; k--) {
          if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
          }
          if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
          }
          if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
          }
        }
      }

      // Enable custom pagination
      if (c.attr('data-dots-custom')) {
        c.on("initialized.owl.carousel", function (event) {
          var carousel = $(event.currentTarget),
            customPag = $(carousel.attr("data-dots-custom")),
            active = 0;

          if (carousel.attr('data-active')) {
            active = parseInt(carousel.attr('data-active'), 10);
          }

          carousel.trigger('to.owl.carousel', [active, 300, true]);
          customPag.find("[data-owl-item='" + active + "']").addClass("active");

          customPag.find("[data-owl-item]").on('click', function (e) {
            e.preventDefault();
            carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
          });

          carousel.on("translate.owl.carousel", function (event) {
            customPag.find(".active").removeClass("active");
            customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
          });
        });
      }

      c.on("initialized.owl.carousel", function () {
        initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
      });

      c.owlCarousel({
        autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
        loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
        items: 1,
        center: c.attr("data-center") === "true",
        dotsContainer: c.attr("data-pagination-class") || false,
        navContainer: c.attr("data-navigation-class") || false,
        mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
        nav: c.attr("data-nav") === "true",
        dots: c.attr("data-dots") === "true",
        dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
        animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
        animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
        responsive: responsive,
        navText: c.attr("data-nav-text") ? $.parseJSON(c.attr("data-nav-text")) : [],
        navClass: c.attr("data-nav-class") ? $.parseJSON(c.attr("data-nav-class")) : ['owl-prev', 'owl-next']
      });
    }

    /**
     * Live Search
     * @description  create live search results
     */
    function liveSearch(options) {
      $('#' + options.live).removeClass('cleared').html();
      options.current++;
      options.spin.addClass('loading');
      $.get(handler, {
        s: decodeURI(options.term),
        liveSearch: options.live,
        dataType: "html",
        liveCount: options.liveCount,
        filter: options.filter,
        template: options.template
      }, function (data) {
        options.processed++;
        var live = $('#' + options.live);
        if (options.processed == options.current && !live.hasClass('cleared')) {
          live.find('> #search-results').removeClass('active');
          live.html(data);
          setTimeout(function () {
            live.find('> #search-results').addClass('active');
          }, 50);
        }
        options.spin.parents('.rd-search').find('.input-group-addon').removeClass('loading');
      })
    }

    /**
     * @desc Attach form validation to elements
     * @param {object} elements - jQuery object
     */
    function attachFormValidator(elements) {
	    // Custom validator - phone number
	    regula.custom({
		    name:           'PhoneNumber',
		    defaultMessage: 'Invalid phone number format',
		    validator:      function () {
			    if (this.value === '') return true;
			    else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
		    }
	    });

	    for (let i = 0; i < elements.length; i++) {
		    let o = $(elements[i]), v;
		    o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
		    v = o.parent().find(".form-validation");
		    if (v.is(":last-child")) o.addClass("form-control-last-child");
	    }

	    elements.on('input change propertychange blur', function (e) {
		    let $this = $(this), results;

		    if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
		    if ($this.parents('.rd-mailform').hasClass('success')) return;

		    if ((results = $this.regula('validate')).length) {
			    for (let i = 0; i < results.length; i++) {
				    $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
			    }
		    } else {
			    $this.siblings(".form-validation").text("").parent().removeClass("has-error")
		    }
	    }).regula('bind');

	    let regularConstraintsMessages = [
		    {
			    type:       regula.Constraint.Required,
			    newMessage: "The text field is required."
		    },
		    {
			    type:       regula.Constraint.Email,
			    newMessage: "The email is not a valid email."
		    },
		    {
			    type:       regula.Constraint.Numeric,
			    newMessage: "Only numbers are required"
		    },
		    {
			    type:       regula.Constraint.Selected,
			    newMessage: "Please choose an option."
		    }
	    ];


	    for (let i = 0; i < regularConstraintsMessages.length; i++) {
		    let regularConstraint = regularConstraintsMessages[i];

		    regula.override({
			    constraintType: regularConstraint.type,
			    defaultMessage: regularConstraint.newMessage
		    });
	    }
    }

	  /**
	   * @desc Check if all elements pass validation
	   * @param {object} elements - object of items for validation
	   * @param {object} captcha - captcha object for validation
	   * @return {boolean}
	   */
	  function isValidated(elements, captcha) {
		  let results, errors = 0;

		  if (elements.length) {
			  for (let j = 0; j < elements.length; j++) {

				  let $input = $(elements[j]);
				  if ((results = $input.regula('validate')).length) {
					  for (let k = 0; k < results.length; k++) {
						  errors++;
						  $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
					  }
				  } else {
					  $input.siblings(".form-validation").text("").parent().removeClass("has-error")
				  }
			  }

			  if (captcha) {
				  if (captcha.length) {
					  return validateReCaptcha(captcha) && errors === 0
				  }
			  }

			  return errors === 0;
		  }
		  return true;
	  }

	  /**
	   * @desc Validate google reCaptcha
	   * @param {object} captcha - captcha object for validation
	   * @return {boolean}
	   */
	  function validateReCaptcha(captcha) {
		  let captchaToken = captcha.find('.g-recaptcha-response').val();

		  if (captchaToken.length === 0) {
			  captcha
				  .siblings('.form-validation')
				  .html('Please, prove that you are not robot.')
				  .addClass('active');
			  captcha
				  .closest('.form-wrap')
				  .addClass('has-error');

			  captcha.on('propertychange', function () {
				  let $this = $(this),
					  captchaToken = $this.find('.g-recaptcha-response').val();

				  if (captchaToken.length > 0) {
					  $this
						  .closest('.form-wrap')
						  .removeClass('has-error');
					  $this
						  .siblings('.form-validation')
						  .removeClass('active')
						  .html('');
					  $this.off('propertychange');
				  }
			  });

			  return false;
		  }

		  return true;
	  }

	  /**
	   * @desc Initialize Google reCaptcha
	   */
	  window.onloadCaptchaCallback = function () {
		  for (let i = 0; i < plugins.captcha.length; i++) {
			  let
				  $captcha = $(plugins.captcha[i]),
				  resizeHandler = (function () {
					  let
						  frame = this.querySelector('iframe'),
						  inner = this.firstElementChild,
						  inner2 = inner.firstElementChild,
						  containerRect = null,
						  frameRect = null,
						  scale = null;

					  inner2.style.transform = '';
					  inner.style.height = 'auto';
					  inner.style.width = 'auto';

					  containerRect = this.getBoundingClientRect();
					  frameRect = frame.getBoundingClientRect();
					  scale = containerRect.width / frameRect.width;

					  if (scale < 1) {
						  inner2.style.transform = 'scale(' + scale + ')';
						  inner.style.height = (frameRect.height * scale) + 'px';
						  inner.style.width = (frameRect.width * scale) + 'px';
					  }
				  }).bind(plugins.captcha[i]);

			  grecaptcha.render(
				  $captcha.attr('id'),
				  {
					  sitekey:  $captcha.attr('data-sitekey'),
					  size:     $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
					  theme:    $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
					  callback: function () {
						  $('.recaptcha').trigger('propertychange');
					  }
				  }
			  );

			  $captcha.after("<span class='form-validation'></span>");

			  if (plugins.captcha[i].hasAttribute('data-auto-size')) {
				  resizeHandler();
				  window.addEventListener('resize', resizeHandler);
			  }
		  }
	  };


    /**
     * @desc Initialize Bootstrap tooltip with required placement
     * @param {string} tooltipPlacement
     */
    function initBootstrapTooltip(tooltipPlacement) {
      plugins.bootstrapTooltip.tooltip('dispose');

      if (window.innerWidth < 576) {
        plugins.bootstrapTooltip.tooltip({placement: 'bottom'});
      } else {
        plugins.bootstrapTooltip.tooltip({placement: tooltipPlacement});
      }
    }

    /**
     * @desc Initialize the gallery with set of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initLightGallery(itemsToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemsToInit).lightGallery({
          thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
          selector: "[data-lightgallery='item']",
          autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
          pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
          addClass: addClass,
          mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
          loop: $(itemsToInit).attr("data-lg-loop") !== "false"
        });
      }
    }

    /**
     * @desc Initialize the gallery with dynamic addition of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initDynamicLightGallery(itemsToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemsToInit).on("click", function () {
          $(itemsToInit).lightGallery({
            thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
            selector: "[data-lightgallery='item']",
            autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
            pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
            addClass: addClass,
            mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
            loop: $(itemsToInit).attr("data-lg-loop") !== "false",
            dynamic: true,
            dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
          });
        });
      }
    }

    /**
     * @desc Initialize the gallery with one image
     * @param {object} itemToInit - jQuery object
     * @param {string} [addClass] - additional gallery class
     */
    function initLightGalleryItem(itemToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemToInit).lightGallery({
          selector: "this",
          addClass: addClass,
          counter: false,
          youtubePlayerParams: {
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            controls: 0
          },
          vimeoPlayerParams: {
            byline: 0,
            portrait: 0
          }
        });
      }
    }


    // Bootstrap Tooltips
    if (plugins.bootstrapTooltip.length) {
      var tooltipPlacement = plugins.bootstrapTooltip.attr('data-bs-placement');
      initBootstrapTooltip(tooltipPlacement);

      $window.on('resize orientationchange', function () {
        initBootstrapTooltip(tooltipPlacement);
      })
    }

    // Bootstrap Modal
    if (plugins.bootstrapModal.length) {
      for (var i = 0; i < plugins.bootstrapModal.length; i++) {
        var modalItem = $(plugins.bootstrapModal[i]);

        modalItem.on('hidden.bs.modal', $.proxy(function () {
          var activeModal = $(this),
            rdVideoInside = activeModal.find('video'),
            youTubeVideoInside = activeModal.find('iframe');

          if (rdVideoInside.length) {
            rdVideoInside[0].pause();
          }

          if (youTubeVideoInside.length) {
            var videoUrl = youTubeVideoInside.attr('src');

            youTubeVideoInside
              .attr('src', '')
              .attr('src', videoUrl);
          }
        }, modalItem))
      }
    }

    // Additional class on html if mac os.
    if (navigator.platform.match(/(Mac)/i)) {
      $html.addClass("mac-os");
    }

    /**
     * Google ReCaptcha
     * @description Enables Google ReCaptcha
     */
	  if (plugins.captcha.length) {
		  $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
	  }


    /**
     * Radio
     * @description Add custom styling options for input[type="radio"]
     */
	  if (plugins.radio.length) {
		  for (let i = 0; i < plugins.radio.length; i++) {
			  $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
		  }
	  }

    /**
     * Checkbox
     * @description Add custom styling options for input[type="checkbox"]
     */
	  if (plugins.checkbox.length) {
		  for (let i = 0; i < plugins.checkbox.length; i++) {
			  $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
		  }
	  }

    // RD Input Label
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }

    // Regula
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }

    // MailChimp Ajax subscription
	  if (plugins.mailchimp.length) {
		  for (let i = 0; i < plugins.mailchimp.length; i++) {
			  let $mailchimpItem = $(plugins.mailchimp[i]),
				  $email = $mailchimpItem.find('input[type="email"]');

			  // Required by MailChimp
			  $mailchimpItem.attr('novalidate', 'true');
			  $email.attr('name', 'EMAIL');

			  $mailchimpItem.on('submit', $.proxy(function ($email, event) {
				  event.preventDefault();

				  let $this = this;

				  let data = {},
					  url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
					  dataArray = $this.serializeArray(),
					  $output = $("#" + $this.attr("data-form-output"));

				  for (i = 0; i < dataArray.length; i++) {
					  data[dataArray[i].name] = dataArray[i].value;
				  }

				  $.ajax({
					  data:       data,
					  url:        url,
					  dataType:   'jsonp',
					  error:      function (resp, text) {
						  $output.html('Server error: ' + text);

						  setTimeout(function () {
							  $output.removeClass("active");
						  }, 4000);
					  },
					  success:    function (resp) {
						  $output.html(resp.msg).addClass('active');
						  $email[0].value = '';
						  let $label = $('[for="' + $email.attr('id') + '"]');
						  if ($label.length) $label.removeClass('focus not-empty');

						  setTimeout(function () {
							  $output.removeClass("active");
						  }, 6000);
					  },
					  beforeSend: function (data) {
						  let isNoviBuilder = window.xMode;

						  let isValidated = (function () {
							  let results, errors = 0;
							  let elements = $this.find('[data-constraints]');
							  let captcha = null;
							  if (elements.length) {
								  for (let j = 0; j < elements.length; j++) {

									  let $input = $(elements[j]);
									  if ((results = $input.regula('validate')).length) {
										  for (let k = 0; k < results.length; k++) {
											  errors++;
											  $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
										  }
									  } else {
										  $input.siblings(".form-validation").text("").parent().removeClass("has-error")
									  }
								  }

								  if (captcha) {
									  if (captcha.length) {
										  return validateReCaptcha(captcha) && errors === 0
									  }
								  }

								  return errors === 0;
							  }
							  return true;
						  })();

						  // Stop request if builder or inputs are invalide
						  if (isNoviBuilder || !isValidated)
							  return false;

						  $output.html('Submitting...').addClass('active');
					  }
				  });

				  return false;
			  }, $mailchimpItem, $email));
		  }
	  }

	  // Campaign Monitor ajax subscription
	  if (plugins.campaignMonitor.length) {
		  for (let i = 0; i < plugins.campaignMonitor.length; i++) {
			  let $campaignItem = $(plugins.campaignMonitor[i]);

			  $campaignItem.on('submit', $.proxy(function (e) {
				  let data = {},
					  url = this.attr('action'),
					  dataArray = this.serializeArray(),
					  $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
					  $this = $(this);

				  for (i = 0; i < dataArray.length; i++) {
					  data[dataArray[i].name] = dataArray[i].value;
				  }

				  $.ajax({
					  data:       data,
					  url:        url,
					  dataType:   'jsonp',
					  error:      function (resp, text) {
						  $output.html('Server error: ' + text);

						  setTimeout(function () {
							  $output.removeClass("active");
						  }, 4000);
					  },
					  success:    function (resp) {
						  $output.html(resp.Message).addClass('active');

						  setTimeout(function () {
							  $output.removeClass("active");
						  }, 6000);
					  },
					  beforeSend: function (data) {
						  // Stop request if builder or inputs are invalide
						  if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
							  return false;

						  $output.html('Submitting...').addClass('active');
					  }
				  });

				  // Clear inputs after submit
				  let inputs = $this[0].getElementsByTagName('input');
				  for (let i = 0; i < inputs.length; i++) {
					  inputs[i].value = '';
					  let label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
					  if (label) label.classList.remove('focus', 'not-empty');
				  }

				  return false;
			  }, $campaignItem));
		  }
	  }

	  // RD Mailform
	  if (plugins.rdMailForm.length) {
		  let i, j, k,
			  msg = {
				  'MF000': 'Successfully sent!',
				  'MF001': 'Recipients are not set!',
				  'MF002': 'Form will not work locally!',
				  'MF003': 'Please, define email field in your form!',
				  'MF004': 'Please, define type of your form!',
				  'MF254': 'Something went wrong with PHPMailer!',
				  'MF255': 'Aw, snap! Something went wrong.'
			  };

		  for (i = 0; i < plugins.rdMailForm.length; i++) {
			  let $form = $(plugins.rdMailForm[i]),
				  formHasCaptcha = false;

			  $form.attr('novalidate', 'novalidate').ajaxForm({
				  data:         {
					  "form-type": $form.attr("data-form-type") || "contact",
					  "counter":   i
				  },
				  beforeSubmit: function (arr, $form, options) {
					  if (isNoviBuilder)
						  return;

					  let form = $(plugins.rdMailForm[this.extraData.counter]),
						  inputs = form.find("[data-constraints]"),
						  output = $("#" + form.attr("data-form-output")),
						  captcha = form.find('.recaptcha'),
						  captchaFlag = true;

					  output.removeClass("active error success");

					  if (isValidated(inputs, captcha)) {

						  // veify reCaptcha
						  if (captcha.length) {
							  let captchaToken = captcha.find('.g-recaptcha-response').val(),
								  captchaMsg = {
									  'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
									  'CPT002': 'Something wrong with google reCaptcha'
								  };

							  formHasCaptcha = true;

							  $.ajax({
								  method: "POST",
								  url:    "bat/reCaptcha.php",
								  data:   {'g-recaptcha-response': captchaToken},
								  async:  false
							  })
								  .done(function (responceCode) {
									  if (responceCode !== 'CPT000') {
										  if (output.hasClass("snackbars")) {
											  output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

											  setTimeout(function () {
												  output.removeClass("active");
											  }, 3500);

											  captchaFlag = false;
										  } else {
											  output.html(captchaMsg[responceCode]);
										  }

										  output.addClass("active");
									  }
								  });
						  }

						  if (!captchaFlag) {
							  return false;
						  }

						  form.addClass('form-in-process');

						  if (output.hasClass("snackbars")) {
							  output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
							  output.addClass("active");
						  }
					  } else {
						  return false;
					  }
				  },
				  error:        function (result) {
					  if (isNoviBuilder)
						  return;

					  let output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
						  form = $(plugins.rdMailForm[this.extraData.counter]);

					  output.text(msg[result]);
					  form.removeClass('form-in-process');

					  if (formHasCaptcha) {
						  grecaptcha.reset();
						  window.dispatchEvent(new Event('resize'));
					  }
				  },
				  success:      function (result) {
					  if (isNoviBuilder)
						  return;

					  let form = $(plugins.rdMailForm[this.extraData.counter]),
						  output = $("#" + form.attr("data-form-output")),
						  select = form.find('select');

					  form
						  .addClass('success')
						  .removeClass('form-in-process');

					  if (formHasCaptcha) {
						  grecaptcha.reset();
						  window.dispatchEvent(new Event('resize'));
					  }

					  result = result.length === 5 ? result : 'MF255';
					  output.text(msg[result]);

					  if (result === "MF000") {
						  if (output.hasClass("snackbars")) {
							  output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
						  } else {
							  output.addClass("active success");
						  }
					  } else {
						  if (output.hasClass("snackbars")) {
							  output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
						  } else {
							  output.addClass("active error");
						  }
					  }

					  form.clearForm();

					  if (select.length) {
						  select.select2("val", "");
					  }

					  form.find('input, textarea').trigger('blur');

					  setTimeout(function () {
						  output.removeClass("active error success");
						  form.removeClass('success');
					  }, 3500);
				  }
			  });
		  }
	  }

    /**
     * IE Polyfills
     * @description  Adds some loosing functionality to IE browsers
     */
    if (isIE) {
	    if (isIE === 12) $html.addClass("ie-edge");
	    if (isIE === 11) $html.addClass("ie-11");
	    if (isIE < 10) $html.addClass("lt-ie-10");
	    if (isIE < 11) $html.addClass("ie-10");
    }

    // Swiper
    if (plugins.swiper.length) {
      for (let i = 0; i < plugins.swiper.length; i++) {

        let
          node = plugins.swiper[i],
          params = parseJSON(node.getAttribute('data-swiper')),
          defaults = {
            speed:      1000,
            loop:       node.getAttribute('data-loop') !== 'false',
            effect:     node.hasAttribute('data-slide-effect') ? node.getAttribute('data-slide-effect') : 'slide',
            pagination: {
              el:        '.swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            },
            autoplay:   {
              enabled: node.getAttribute('data-autoplay') !== 'false',
              delay: !isNaN( Number( node.getAttribute('data-autoplay') ) ) ? node.getAttribute('data-autoplay') : 5000,
            }
          },
          xMode = {
            autoplay:      false,
            loop:          false,
            simulateTouch: false
          };

        params.on = {
          init: function () {
            setBackgrounds(this);
            toggleSwiperCaptionAnimation(this);

            // Real Previous Index must be set recent
            this.on('slideChangeTransitionEnd', function () {
              toggleSwiperCaptionAnimation(this);
            });
          }
        };

        new Swiper(node, Util.merge(isNoviBuilder ? [defaults, params, xMode] : [defaults, params]));

        $(window).on("resize", function () {
          let mh = getSwiperHeight($(node), "min-height");
          let h = getSwiperHeight($(node), "height");

          if (h) $(node).css("height", mh ? mh > h ? mh : h : h);
        }).trigger("resize");
      }
    }


    // Bootstrap Accordion
    if (plugins.bootstrapAccordion.length) {
      for (let i = 0; i < plugins.bootstrapAccordion.length; i++) {
        let bootstrapCard = plugins.bootstrapAccordion[i];

        let cardHeads = bootstrapCard.querySelectorAll('.accordion-button');

        for (let t = 0; t < cardHeads.length; t++) {
          let cardHead = cardHeads[t];

          cardHead.classList.add('collapsed');
          cardHead.setAttribute('aria-expanded', 'false')

          if (t === 0) {
            cardHead.classList.remove('collapsed');
            cardHead.setAttribute('aria-expanded', 'true')
          }
        }
      }
    }


    // Copyright Year (Evaluates correct copyright year)
    if (plugins.copyrightYear.length) {
      plugins.copyrightYear.text(initialDate.getFullYear());
    }


    // Bootstrap tabs
    if (plugins.bootstrapTabs.length) {
      for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
        var bootstrapTab = $(plugins.bootstrapTabs[i]);

        //If have slick carousel inside tab - resize slick carousel on click
        if (bootstrapTab.find('.slick-slider').length) {
          bootstrapTab.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
            var $this = $(this);
            var setTimeOutTime = isNoviBuilder ? 1500 : 300;

            setTimeout(function () {
              $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
            }, setTimeOutTime);
          }, bootstrapTab));
        }

        var tabs = plugins.bootstrapTabs[i].querySelectorAll('.nav li a');

        for (var t = 0; t < tabs.length; t++) {
          var tab = tabs[t];

          if (t === 0) {
            tab.parentElement.classList.remove('active');
            $(tab).tab('show');
          }

          tab.addEventListener('click', function (event) {
            event.preventDefault();
            $(this).tab('show');
          });
        }
      }
    }


    /**
     * RD Audio player
     * @description Enables RD Audio player plugin
     */
    if (plugins.rdAudioPlayer.length) {
      var i;
      for (i = 0; i < plugins.rdAudioPlayer.length; i++) {
        $(plugins.rdAudioPlayer[i]).RDAudio();
      }
      var playlistButton = $('.rd-audio-playlist-button');
      var playlist = plugins.rdAudioPlayer.find('.rd-audio-playlist-wrap');
      if (playlistButton.length) {
        playlistButton.on('click', function (e) {
          e.preventDefault();
          plugins.rdAudioPlayer.toggleClass('playlist-show');
          if (playlist.is(':hidden')) {
            playlist.slideDown(300);
          } else {
            playlist.slideUp(300);
          }
        });
        $document.on('click', function (e) {
          if (!$(e.target).is(playlist) && playlist.find($(e.target)).length == 0 && !$(e.target).is(playlistButton)) {
            playlist.slideUp(300);
          }
        });


      }
    }


    // lightGallery
    if (plugins.lightGallery.length) {
      for (var i = 0; i < plugins.lightGallery.length; i++) {
        initLightGallery(plugins.lightGallery[i]);
      }
    }

    // lightGallery item
    if (plugins.lightGalleryItem.length) {
      // Filter carousel items
      var notCarouselItems = [];

      for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
        if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
          !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
          !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
          notCarouselItems.push(plugins.lightGalleryItem[z]);
        }
      }

      plugins.lightGalleryItem = notCarouselItems;

      for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
        initLightGalleryItem(plugins.lightGalleryItem[i]);
      }
    }

    // Dynamic lightGallery
    if (plugins.lightDynamicGalleryItem.length) {
      for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
        initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
      }
    }


    /**
     * RD Video Player
     * @description Enables RD Video player plugin
     */
    function hidePlaylist() {
      $(".rd-video-player").removeClass("playlist-show");
    }

    function showPlaylist() {
      $(".rd-video-player").addClass("playlist-show");
    }

    if (plugins.rdVideoPlayer.length) {
      var i;
      for (i = 0; i < plugins.rdVideoPlayer.length; i++) {
        var videoItem = $(plugins.rdVideoPlayer[i]);

        $window.on("scroll", $.proxy(function () {
          var video = $(this);
          if (isDesktop && !video.hasClass("played") && video.hasClass('play-on-scroll') && isScrolledIntoView(video)) {
            video.find("video")[0].play();
            video.addClass("played");
          }
        }, videoItem));

        videoItem.RDVideoPlayer({
          callbacks: {
            onPlay: hidePlaylist,
            onPaused: showPlaylist,
            onEnded: showPlaylist
          }
        });
        $window.on('load', showPlaylist);

        var volumeWrap = $(".rd-video-volume-wrap");

        volumeWrap.on("mouseenter", function () {
          $(this).addClass("hover")
        });

        volumeWrap.on("mouseleave", function () {
          $(this).removeClass("hover")
        });

        if (isTouch) {
          volumeWrap.find(".rd-video-volume").on("click", function () {
            $(this).toggleClass("hover")
          });
          $document.on("click", function (e) {
            if (!$(e.target).is(volumeWrap) && $(e.target).parents(volumeWrap).length == 0) {
              volumeWrap.find(".rd-video-volume").removeClass("hover")
            }
          })
        }
      }
    }


    /**
     * RD Twitter Feed
     * @description Enables RD Twitter Feed plugin
     */
    if (plugins.twitterfeed.length > 0) {
      var i;
      for (i = 0; i < plugins.twitterfeed.length; i++) {
        var twitterfeedItem = plugins.twitterfeed[i];
        $(twitterfeedItem).RDTwitter({
          hideReplies: false,
          localTemplate: {
            avatar: "images/features/rd-twitter-post-avatar-48x48.jpg"
          },
          callback: function () {
            $window.trigger("resize");
          }
        });
      }
    }

    /**
     * Stepper
     * @description Enables Stepper Plugin
     */
    if (plugins.stepper.length) {
      plugins.stepper.stepper({
        labels: {
          up: "",
          down: ""
        }
      });
    }


    /**
     * WOW
     * @description Enables Wow animation plugin
     */
    if ($html.hasClass('desktop') && $html.hasClass("wow-animation") && $(".wow").length) {
      new WOW().init();
    }

    /**
     * Text Rotator
     * @description Enables Text Rotator plugin
     */
    if (plugins.textRotator.length) {
      var i;
      for (i = 0; i < plugins.textRotator.length; i++) {
        var textRotatorItem = $(plugins.textRotator[i]);
        textRotatorItem.rotator();
      }
    }


    /**
     *  Enable Faceboock iframe
     */
    if (plugins.facebookplugin.length) {
      for (i = 0; i < plugins.facebookplugin.length; i++) {

        (function (d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s);
          js.id = id;
          js.src = "//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.5";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      }
    }

    // Owl carousel
    if (plugins.owl.length) {
      for (var i = 0; i < plugins.owl.length; i++) {
        var c = $(plugins.owl[i]);
        plugins.owl[i].owl = c;

        initOwlCarousel(c);
      }
    }

    /**
     * RD Navbar
     * @description Enables RD Navbar plugin
     */
	  if (plugins.rdNavbar.length) {
		  let
			  navbar = plugins.rdNavbar,
			  aliases = {
				  '-':     0,
				  '-sm-':  576,
				  '-md-':  768,
				  '-lg-':  992,
				  '-xl-':  1200,
				  '-xxl-': 1600
			  },
			  responsive = {},
			  navItems = $('.rd-nav-item');

		  for (let i = 0; i < navItems.length; i++) {
			  let node = navItems[i];

			  if (node.classList.contains('opened')) {
				  node.classList.remove('opened')
			  }
		  }

		  for (let alias in aliases) {
			  let link = responsive[aliases[alias]] = {};
			  if (navbar.attr('data' + alias + 'layout')) link.layout = navbar.attr('data' + alias + 'layout');
			  if (navbar.attr('data' + alias + 'device-layout')) link.deviceLayout = navbar.attr('data' + alias + 'device-layout');
			  if (navbar.attr('data' + alias + 'hover-on')) link.focusOnHover = navbar.attr('data' + alias + 'hover-on') === 'true';
			  if (navbar.attr('data' + alias + 'auto-height')) link.autoHeight = navbar.attr('data' + alias + 'auto-height') === 'true';
			  if (navbar.attr('data' + alias + 'stick-up-offset')) link.stickUpOffset = navbar.attr('data' + alias + 'stick-up-offset');
			  if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
			  if (isNoviBuilder) link.stickUp = false;
			  else if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
		  }

		  plugins.rdNavbar.RDNavbar({
			  anchorNav:    !isNoviBuilder,
			  stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
			  responsive:   responsive,
			  callbacks:    {
				  onStuck:        function () {
					  let navbarSearch = this.$element.find('.rd-search input');

					  if (navbarSearch) {
						  navbarSearch.val('').trigger('propertychange');
					  }
				  },
				  onDropdownOver: function () {
					  return !isNoviBuilder;
				  },
				  onUnstuck:      function () {
					  if (this.$clone === null)
						  return;

					  let navbarSearch = this.$clone.find('.rd-search input');

					  if (navbarSearch) {
						  navbarSearch.val('').trigger('propertychange');
						  navbarSearch.trigger('blur');
					  }

				  }
			  }
		  });
	  }

    if (plugins.vide.length) {
      for (var i = 0; i < plugins.vide.length; i++) {
        var $element = $(plugins.vide[i]),
          options = $element.data('vide-options'),
          path = $element.data('vide-bg');

        $element.vide(path, options);

        var
          videObj = $element.data('vide').getVideoObject(),
          scrollHandler = (function ($element) {
            if (isScrolledIntoView($element)) this.play();
            else this.pause();
          }).bind(videObj, $element);
        scrollHandler();
        if (isNoviBuilder) videObj.pause();
        else document.addEventListener('scroll', scrollHandler);
      }
    }


    /**
     * Stacktable
     * @description Enables Stacktable plugin
     */
    if (plugins.stacktable.length) {
      var i;
      for (i = 0; i < plugins.stacktable.length; i++) {
        var stacktableItem = $(plugins.stacktable[i]);
        stacktableItem.stacktable();
      }
    }

    /**
     * Select2
     * @description Enables select2 plugin
     */
    if (plugins.selectFilter.length) {
      var i;
      for (i = 0; i < plugins.selectFilter.length; i++) {
        var select = $(plugins.selectFilter[i]);

        select.select2({
          theme: "bootstrap",
	        placeholder:             select.attr( 'data-placeholder' ) || null,
	        minimumResultsForSearch: select.attr( 'data-minimum-results-for-search' ) || Infinity,
	        containerCssClass:       select.attr( 'data-container-class' ) || null,
	        dropdownCssClass:        select.attr( 'data-dropdown-class' ) || null,
        }).next().addClass(select.attr("class").match(/(input-sm)|(input-lg)|($)/i).toString().replace(new RegExp(",", 'g'), " "));
      }
    }

    /**
     * Product Thumbnails
     * @description Enables product thumbnails
     */
    if (plugins.productThumb.length) {
      var i;
      for (i = 0; i < plugins.productThumb.length; i++) {
        var thumbnails = $(plugins.productThumb[i]);

        thumbnails.find("li").on('click', function () {
          var item = $(this);
          item.parent().find('.active').removeClass('active');
          var image = item.parents(".product").find(".product-image-area");
          image.removeClass('animateImageIn');
          image.addClass('animateImageOut');
          item.addClass('active');
          setTimeout(function () {
            var src = item.find("img").attr("src");
            if (item.attr('data-large-image')) {
              src = item.attr('data-large-image');
            }
            image.attr("src", src);
            image.removeClass('animateImageOut');
            image.addClass('animateImageIn');
          }, 300);
        })
      }
    }

    /**
     * RD Calendar
     * @description Enables RD Calendar plugin
     */
    if (plugins.calendar.length) {
      for (i = 0; i < plugins.calendar.length; i++) {
        var calendarItem = $(plugins.calendar[i]);

        calendarItem.rdCalendar({
          days: calendarItem.attr("data-days") ? c.attr("data-days").split(/\s?,\s?/i) : ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
          month: calendarItem.attr("data-months") ? c.attr("data-months").split(/\s?,\s?/i) : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        });
      }
    }

    /**
     * jQuery elevateZoom
     * @description Enables jQuery elevateZoom plugin
     */
    if (plugins.imgZoom.length) {
      for (i = 0; i < plugins.imgZoom.length; i++) {
        var zoomItem = $(plugins.imgZoom[i]);

        zoomItem.elevateZoom({
          zoomType: "inner",
          cursor: "crosshair",
          zoomWindowFadeIn: 300,
          zoomWindowFadeOut: 300,
          scrollZoom: true
        });
      }
    }

    /**
     * RD Facebook
     * @description Enables RD Facebook plugin
     */
    if (plugins.facebookfeed.length > 0) {
      for (i = 0; i < plugins.facebookfeed.length; i++) {
        var facebookfeedItem = plugins.facebookfeed[i];
        $(facebookfeedItem).RDFacebookFeed({
          callbacks: {
            postsLoaded: function () {
              var posts = $('.post-facebook');
              var i = 0;
              for (i = 0; i < posts.length; i++) {
                var $this = $(posts[i]);
                var commentBlock = $this.find('.post-comments');
                var commentBlockItem = $this.find('.post-comments [data-fb-comment]');
                var j = 0;
                for (j = 0; j < commentBlockItem.length; j++) {
                  var commentItem = commentBlockItem[j];
                  if (commentItem.innerHTML.trim().length == 0) {
                    $(commentItem).remove();
                  }
                }
                if (commentBlock.find('[data-fb-comment]').length == 0) {
                  commentBlock.remove();
                }
              }

              $window.trigger("resize");
            }
          }
        })
      }
    }

    /**
     * Page loader
     * @description Enables Page loader
     */
    if (plugins.pageLoader.length > 0) {

      $window.on("load", function () {
        var loader = setTimeout(function () {
          plugins.pageLoader.addClass("loaded");
          $window.trigger("resize");
        }, 200);
      });

    }

    /**
     * RD Search
     * @description Enables search
     */
    if (plugins.search.length || plugins.searchResults) {
      var handler = "bat/rd-search.php";
      var defaultTemplate = '<h5 class="search_title"><a target="_top" href="#{href}" class="search_link">#{title}</a></h5>' +
        '<p>...#{token}...</p>' +
        '<p class="match"><em>Terms matched: #{count} - URL: #{href}</em></p>';
      var defaultFilter = '*.html';

      if (plugins.search.length) {

        for (i = 0; i < plugins.search.length; i++) {
          var searchItem = $(plugins.search[i]),
            options = {
              element: searchItem,
              filter: (searchItem.attr('data-search-filter')) ? searchItem.attr('data-search-filter') : defaultFilter,
              template: (searchItem.attr('data-search-template')) ? searchItem.attr('data-search-template') : defaultTemplate,
              live: (searchItem.attr('data-search-live')) ? searchItem.attr('data-search-live') : false,
              liveCount: (searchItem.attr('data-search-live-count')) ? parseInt(searchItem.attr('data-search-live')) : 4,
              current: 0, processed: 0, timer: {}
            };

          if ($('.rd-navbar-search-toggle').length) {
            var toggle = $('.rd-navbar-search-toggle');
            toggle.on('click', function () {
              if (!($(this).hasClass('active'))) {
                searchItem.find('input').val('').trigger('propertychange');
              }
            });
          }

          if (options.live) {
            searchItem.find('input').on("keyup input propertychange", $.proxy(function () {
              this.term = this.element.find('input').val().trim();
              this.spin = this.element.find('.input-group-addon');
              clearTimeout(this.timer);

              if (this.term.length > 2) {
                this.timer = setTimeout(liveSearch(this), 200);
              } else if (this.term.length == 0) {
                $('#' + this.live).addClass('cleared').html('');
              }
            }, options, this));
          }

          searchItem.submit($.proxy(function () {
            $('<input />').attr('type', 'hidden')
              .attr('name', "filter")
              .attr('value', this.filter)
              .appendTo(this.element);
            return true;
          }, options, this))
        }
      }

      if (plugins.searchResults.length) {
        var regExp = /\?.*s=([^&]+)\&filter=([^&]+)/g;
        var match = regExp.exec(location.search);

        if (match != null) {
          $.get(handler, {
            s: decodeURI(match[1]),
            dataType: "html",
            filter: match[2],
            template: defaultTemplate,
            live: ''
          }, function (data) {
            plugins.searchResults.html(data);
          })
        }
      }
    }

    /**
     * RD Instafeed
     * @description Enables Instafeed
     */
    if (plugins.instafeed.length > 0) {
      var i;
      for (i = 0; i < plugins.instafeed.length; i++) {
        var instafeedItem = $(plugins.instafeed[i]);
        instafeedItem.RDInstafeed({});
      }
    }

    // UI To Top
    if (isDesktop && !isNoviBuilder) {
      $().UItoTop({
        easingType: 'easeOutQuart',
        containerClass: 'ui-to-top icon icon-xs icon-circle icon-darker-filled mdi mdi-chevron-up'
      });
    }


    // Custom Toggles
    if (plugins.customToggle.length) {
      for (var i = 0; i < plugins.customToggle.length; i++) {
        var $this = $(plugins.customToggle[i]);

        $this.on('click', $.proxy(function (event) {
          event.preventDefault();

          var $ctx = $(this);
          $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
        }, $this));

        if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (e.target !== e.data[0]
              && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
              && e.data.find($(e.target)).length === 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }

        if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
          $body.on("click", $this, function (e) {
            if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }
      }
    }

    /**
     * Custom Waypoints
     */
    if (plugins.customWaypoints.length) {
      var i;
      $document.delegate("[data-custom-scroll-to]", "click", function (e) {
        e.preventDefault();
        $("body, html").stop().animate({
          scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
        }, 1000, function () {
          $(window).trigger("resize");
        });
      });
    }

    /**
     * Bootstrap Date time picker
     */
    if (plugins.bootstrapDateTimePicker.length) {
      var i;
      for (i = 0; i < plugins.bootstrapDateTimePicker.length; i++) {
        var $dateTimePicker = $(plugins.bootstrapDateTimePicker[i]);
        var options = {};

        options['format'] = 'dddd DD MMMM YYYY - HH:mm';
        if ($dateTimePicker.attr("date-time-picker") == "date") {
          options['format'] = 'dddd DD MMMM YYYY';
          options['minDate'] = new Date();
        } else if ($dateTimePicker.attr("date-time-picker") == "time") {
          options['format'] = 'HH:mm';
        }

        options["time"] = ($dateTimePicker.attr("date-time-picker") != "date");
        options["date"] = ($dateTimePicker.attr("date-time-picker") != "time");
        options["shortTime"] = true;

        $dateTimePicker.bootstrapMaterialDatePicker(options);
      }
    }

    /**
     * RD Filepicker
     * @description Enables RD Filepicker plugin
     */
    if (plugins.filePicker.length || plugins.fileDrop.length) {
      var i;
      for (i = 0; i < plugins.filePicker.length; i++) {
        var filePickerItem = plugins.filePicker[i];

        $(filePickerItem).RDFilepicker({
          metaFieldClass: "rd-file-picker-meta"
        });
      }

      for (i = 0; i < plugins.fileDrop.length; i++) {
        var fileDropItem = plugins.fileDrop[i];

        $(fileDropItem).RDFilepicker({
          metaFieldClass: "rd-file-drop-meta",
          buttonClass: "rd-file-drop-btn",
          dropZoneClass: "rd-file-drop"
        });
      }
    }

    /**
     * Slick carousel
     * @description  Enable Slick carousel plugin
     */
    if (plugins.slick.length) {
      var i;
      for (i = 0; i < plugins.slick.length; i++) {
        var $slickItem = $(plugins.slick[i]);
        $slickItem.slick({
          slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
          asNavFor: $slickItem.attr('data-for') || false,
          adaptiveHeight: $slickItem.attr("data-adaptiveheight") === "true",
          dots: $slickItem.attr("data-dots") === "true",
          infinite: $slickItem.attr("data-loop") === "true",
          focusOnSelect: true,
          arrows: $slickItem.attr("data-arrows") === "true",
          swipe: $slickItem.attr("data-swipe") === "true",
          autoplay: $slickItem.attr("data-autoplay") === "true",
          vertical: $slickItem.attr("data-vertical") === "true",
          centerMode: $slickItem.attr("data-center-mode") === "true",
          centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
          mobileFirst: true,
          fade: $slickItem.attr("data-fade") ? $slickItem.attr("data-fade") : false,
          responsive: [
            {
              breakpoint: 0,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
              }
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
              }
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
              }
            }
          ]
        })
          .on('afterChange', function (event, slick, currentSlide, nextSlide) {

            var $this = $(this),
              childCarousel = $this.attr('data-child');

            if (childCarousel) {
              $(childCarousel + ' .slick-slide').removeClass('slick-current');
              $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
            }
          });
      }
    }

	  // Countdown
    if (plugins.countdown.length) {
      for (let i = 0; i < plugins.countdown.length; i++) {
        let
          node = plugins.countdown[i],
          countdown = aCountdown({
            node: node,
            from: node.getAttribute('data-from'),
            to: node.getAttribute('data-to'),
            count: node.getAttribute('data-count'),
            tick: 100,
          });
      }
    }
  });
}());