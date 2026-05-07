var THEMEMASCOT = {};
(function($) {

    "use strict";

    /* ---------------------------------------------------------------------- */
    /* --------------------------- Start Demo Switcher  --------------------- */
    /* ---------------------------------------------------------------------- */
    var showSwitcher = false;
    var $body = $('body');
    var $style_switcher = $('#style-switcher');
    if (!$style_switcher.length && showSwitcher) {
        $.ajax({
            url: "color-switcher/style-switcher.html",
            success: function(data) {
                $body.append(data);
            },
            dataType: 'html'
        });
    }

    /* ---------------------------------------------------------------------- */
    /* ----------------------------- En Demo Switcher  ---------------------- */
    /* ---------------------------------------------------------------------- */


    //   THEMEMASCOT.isRTL = {
    //     check: function() {
    //       if( $( "html" ).attr("dir") === "rtl" ) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }
    //   };

    //   THEMEMASCOT.isLTR = {
    //     check: function() {
    //       if( $( "html" ).attr("dir") !== "rtl" ) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }
    //   };

    // Preloader js
    $(window).on("load", function() {
        const Preloader = $(".preloader");

        function initAnimations() {
            if (typeof wowController === "function") {
                wowController();
            }
            if (typeof gsapController === "function") {
                gsapController();
            }
        }
        if (Preloader.length) {
            setTimeout(function() {
                Preloader.removeClass("is-loading").addClass("is-loaded");
                setTimeout(function() {
                    Preloader.fadeOut(400);
                    initAnimations();
                }, 700);
            }, 2000);
        } else {
            initAnimations();
        }
    });



    // Call headerStyle on scroll
    $(window).on('scroll', function() {
        headerStyle();
    });

    // Also call on page load to handle reload
    $(document).on("ready", function() {});


    //Update Header Style and Scroll to Top
    function headerStyle() {
        if ($('.main-header').length) {
            var windowpos = $(window).scrollTop();
            var siteHeader = $('.header-style-one');
            var scrollLink = $('.scroll-to-top');
            var sticky_header = $('.main-header .sticky-header');
            if (windowpos > 100) {
                sticky_header.addClass("fixed-header animated slideInDown");
                scrollLink.fadeIn(300);
            } else {
                sticky_header.removeClass("fixed-header animated slideInDown");
                scrollLink.fadeOut(300);
            }
            if (windowpos > 1) {
                siteHeader.addClass("fixed-header");
            } else {
                siteHeader.removeClass("fixed-header");
            }
        }
    }
    headerStyle();

    //Header Search
    if ($(".search-btn").length) {
        $(".search-btn").on("click", function() {
            $(".main-header").addClass("moblie-search-active");
        });
        $(".close-search, .search-back-drop").on("click", function() {
            $(".main-header").removeClass("moblie-search-active");
        });
    }

    // Header hide on scroll down, show on scroll up (optional)

    if ($(window).width() > 991) {
        if ($(window).width() > 768) {
            $('.parallaxie').parallaxie({
                speed: 0.55,
                offset: 0,
            });
        }
    }

    // hover animation
    const $items = $(".case-block-four");

    // set second one active by default
    $items.eq(1).addClass("active");

    $items.hover(function() {
        $items.removeClass("active");
        $(this).addClass("active");
    });

    //Submenu Dropdown Toggle
    if ($('.main-header li.dropdown ul').length) {
        $('.main-header .navigation li.dropdown').append('<div class="dropdown-btn"><i class="fa fa-angle-down"></i></div>');
    }

    // Sync active menu item with current page URL.
    function setActiveMenuByPath() {
        var path = window.location.pathname.split('/').pop() || 'index.html';

        $('.main-header .navigation li').removeClass('current');

        if (path === 'index.html') {
            $('.main-header .navigation a[href="index.html"]').first().closest('li').addClass('current');
            return;
        }

        var $matchedLinks = $('.main-header .navigation a[href]').filter(function() {
            var href = $(this).attr('href') || '';
            if (!href || href === '#') {
                return false;
            }
            return href.split('#')[0] === path;
        });

        if ($matchedLinks.length) {
            var $targetLi = $matchedLinks.first().closest('li');
            $targetLi.addClass('current');
            $targetLi.parents('li.dropdown').addClass('current');
        }
    }

    setActiveMenuByPath();

    //Mobile Nav Hide Show
    if ($('.mobile-menu').length) {

        var mobileMenuContent = $('.main-header .main-menu .navigation').html();

        $('.mobile-menu .navigation').append(mobileMenuContent);
        $('.sticky-header .navigation').append(mobileMenuContent);
        $('.mobile-menu .close-btn').on('click', function() {
            $('body').removeClass('mobile-menu-visible');
        });

        //Dropdown Button
        $('.mobile-menu li.dropdown .dropdown-btn').on('click', function() {
            $(this).prev('ul').slideToggle(500);
            $(this).toggleClass('active');
        });

        // Also allow toggle when clicking the parent dropdown text link.
        $('.mobile-menu li.dropdown > a').on('click', function(e) {
            var href = $(this).attr('href') || '';
            if (href === '#' || href === '') {
                e.preventDefault();
                var $submenu = $(this).next('ul');
                var $toggle = $(this).siblings('.dropdown-btn');
                if ($submenu.length) {
                    $submenu.slideToggle(500);
                    $toggle.toggleClass('active');
                }
            }
        });

        //Menu Toggle Btn
        $('.mobile-nav-toggler').on('click', function() {
            $('body').addClass('mobile-menu-visible');
        });

        //Menu Toggle Btn
        $('.mobile-menu .menu-backdrop, .mobile-menu .close-btn').on('click', function() {
            $('body').removeClass('mobile-menu-visible');
        });

    }

    //Header Search
    if ($(".search-btn").length) {
        $(".search-btn").on("click", function() {
            $(".main-header").addClass("moblie-search-active");
        });
        $(".close-search, .search-back-drop").on("click", function() {
            $(".main-header").removeClass("moblie-search-active");
        });
    }

    //Fact Counter + Text Count
    if ($(".count-box").length) {
        $(".count-box").appear(
            function() {
                var $t = $(this),
                    n = $t.find(".count-text").attr("data-stop"),
                    r = parseInt($t.find(".count-text").attr("data-speed"), 10),
                    easingType = $.easing && $.easing.easeInOutQuad ? "easeInOutQuad" : "swing";

                if (!$t.hasClass("counted")) {
                    $t.addClass("counted");
                    $({
                        countNum: $t.find(".count-text").text(),
                    }).animate({
                        countNum: n,
                    }, {
                        duration: r,
                        easing: easingType,
                        step: function() {
                            $t.find(".count-text").text(Math.floor(this.countNum));
                        },
                        complete: function() {
                            $t.find(".count-text").text(this.countNum);
                        },
                    });
                }
            }, {
                accY: 0
            }
        );
    }

    // count Bar
    if ($(".count-bar").length) {
        $(".count-bar").appear(
            function() {
                var el = $(this);
                var percent = el.data("percent");
                $(el).css("width", percent).addClass("counted");
            }, {
                accY: -50,
            }
        );
    }

    //Price Range Slider
    if ($(".price-range-slider").length) {
        $(".price-range-slider").slider({
            range: true,
            min: 10,
            max: 99,
            values: [10, 60],
            slide: function(event, ui) {
                $("input.property-amount").val(ui.values[0] + " - " + ui.values[1]);
            },
        });

        $("input.property-amount").val(
            $(".price-range-slider").slider("values", 0) +
            " - $" +
            $(".price-range-slider").slider("values", 1)
        );
    }

    // Image move with mouse Feature Block Resort Home Layout 3
    // if ($(".award-block-two .list-item").length) {
    //   const $items = $(".award-block-two .list-item");

    //   $items.each(function () {
    //     const $item = $(this);
    //     const $hoverImage = $item.find(".hover-image");

    //     // ===== Mouse move image follow =====
    //     if ($hoverImage.length) {
    //       $item.on("mousemove", function (e) {
    //         const offset = $item.offset();
    //         const dx = e.pageX - offset.left;
    //         const dy = e.pageY - offset.top;

    //         $hoverImage.css(
    //           "transform",
    //           `translate(${dx}px, ${dy}px) rotate(-5deg)`
    //         );
    //       });
    //     }

    //     // ===== Border control for previous item =====
    //     $item.on("mouseenter", function () {
    //       $items.removeClass("prev-no-border"); // reset
    //       $(this).prev(".list-item").addClass("prev-no-border");
    //     });

    //     $item.on("mouseleave", function () {
    //       $items.removeClass("prev-no-border"); // restore when leaving
    //     });
    //   });
    // }

    /* ================================
      Hover Active Js Start
    ================================ */

    //Service Hover image
    document.addEventListener("DOMContentLoaded", function() {
        const serviceItems = document.querySelectorAll(".service-block-two .inner-box");
        const imageBoxes = document.querySelectorAll(".service-hover-image .image-box");

        if (!serviceItems.length || !imageBoxes.length) return;

        // first active
        serviceItems[0].classList.add("active");
        imageBoxes[0].classList.add("active");

        serviceItems.forEach(item => {
            item.addEventListener("mouseenter", function() {
                const index = this.dataset.index;

                imageBoxes.forEach(box => box.classList.remove("active"));
                serviceItems.forEach(i => i.classList.remove("active"));

                const activeBox = document.querySelector(
                    `.service-hover-image .image-box[data-index="${index}"]`
                );

                if (activeBox) activeBox.classList.add("active");
                this.classList.add("active");
            });
        });
    });

    if ($('.service-block-three .inner-box').length) {
        $('.service-block-three .inner-box').on('mouseenter', function() {
            $('.service-block-three .inner-box').removeClass('active');
            $(this).addClass('active');
        });
    }

    //product bxslider
    if ($(".product-details .bxslider").length) {
        $(".product-details .bxslider").bxSlider({
            nextSelector: ".product-details #slider-next",
            prevSelector: ".product-details #slider-prev",
            nextText: '<i class="fa fa-angle-right"></i>',
            prevText: '<i class="fa fa-angle-left"></i>',
            mode: "fade",
            auto: "true",
            speed: "700",
            pagerCustom: ".product-details .slider-pager .thumb-box",
        });
    }
    //Tabs Box

    //Quantity box
    $(".quantity-box .add").on("click", function() {
        if ($(this).prev().val() < 999) {
            $(this)
                .prev()
                .val(+$(this).prev().val() + 1);
        }
    });
    $(".quantity-box .sub").on("click", function() {
        if ($(this).next().val() > 1) {
            if ($(this).next().val() > 1)
                $(this)
                .next()
                .val(+$(this).next().val() - 1);
        }
    });

    $(".working-block-one .inner-block").on("mouseenter", function() {
        $(".working-block-one .inner-block").removeClass("active");
        $(this).addClass("active");
    });



    if ($(".award-block-two .list-item, .award-block-three .list-item").length) {
        const $items = $(".award-block-two .list-item, .award-block-three .list-item");

        $items.each(function() {
            const $item = $(this);
            // ===== Mouse move image follow =====

            // ===== Border control for previous item =====
            $item.on("mouseenter", function() {
                $items.removeClass("prev-no-border"); // reset
                $(this).prev(".list-item").addClass("prev-no-border");
            });

            $item.on("mouseleave", function() {
                $items.removeClass("prev-no-border"); // restore when leaving
            });
        });
    }

    if ($(".award-block-three .list-item").length) {
        const $items = $(".award-block-three .list-item");
        $items.each(function() {
            const $item = $(this);
            const $hoverImage = $item.find(".hover-image");
            // ===== Mouse move image follow =====
            if ($hoverImage.length) {
                $item.on("mousemove", function(e) {
                    const offset = $item.offset();
                    const dx = e.pageX - offset.left;
                    const dy = e.pageY - offset.top;

                    $hoverImage.css(
                        "transform",
                        `translate(${dx}px, ${dy}px) rotate(-5deg)`
                    );
                });
            }
            // ===== Border control for previous item =====
            $item.on("mouseenter", function() {
                $items.removeClass("prev-no-border"); // reset
                $(this).prev(".list-item").addClass("prev-no-border");
            });

            $item.on("mouseleave", function() {
                $items.removeClass("prev-no-border"); // restore when leaving
            });
        });
    }

    // Horizontal accordion js area start here ***
    $(".hzAccordion__item").on("click", function() {
        $(this).addClass("active").siblings().removeClass("active");
    });
    // Horizontal accordion js area end here ***


    // Project Image Slider
    if ($('.project-image-slider').length) {
        var swiper = new Swiper(".project-image-slider", {
            slidesPerView: 2,
            spaceBetween: 30,
            speed: 600,
            loop: true,
            breakpoints: {
                320: {
                    slidesPerView: 1,
                },
                576: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 1,
                },
                992: {
                    slidesPerView: 2,
                },
                1023: {
                    slidesPerView: 2,
                },
            },
        });
    }

    /* ================================
      Custom Accordion Js Start
    ================================ */

    if ($('.accordion-box').length) {
        $(".accordion-box").on('click', '.acc-btn', function() {
            var outerBox = $(this).closest('.accordion-box');
            var target = $(this).closest('.accordion');
            var accBtn = $(this);
            var accContent = accBtn.next('.acc-content');

            if (target.hasClass('active-block')) {
                // Already open, so close it
                accBtn.removeClass('active');
                target.removeClass('active-block');
                accContent.slideUp(300);
            } else {
                // Close all others
                outerBox.find('.accordion').removeClass('active-block');
                outerBox.find('.acc-btn').removeClass('active');
                outerBox.find('.acc-content').slideUp(300);

                // Open clicked one
                accBtn.addClass('active');
                target.addClass('active-block');
                accContent.slideDown(300);
            }
        });
    }

    /* ================================
      Brand Slider Js Start
    ================================ */

    if ($('.brand-slider').length > 0) {
        const brandSlider = new Swiper(".brand-slider", {
            spaceBetween: 0,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            breakpoints: {
                1199: {
                    slidesPerView: 5,
                },
                991: {
                    slidesPerView: 4,
                },
                767: {
                    slidesPerView: 3,
                },
                575: {
                    slidesPerView: 3,
                },
                400: {
                    slidesPerView: 2,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    if ($('.brand-slider-3').length > 0) {
        const brandSlider3 = new Swiper(".brand-slider-3", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            breakpoints: {
                1199: {
                    slidesPerView: 5,
                },
                991: {
                    slidesPerView: 4,
                },
                767: {
                    slidesPerView: 3,
                },
                575: {
                    slidesPerView: 3,
                },
                400: {
                    slidesPerView: 2,
                },
                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    /* ================================
       Testimonial Slider Js Start
     ================================ */

    if ($('.testimonial-slider').length > 0) {
        const testimonialSlider = new Swiper(".testimonial-slider", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".array-next",
                prevEl: ".array-prev",
            },
        });
    }

    if ($('.testimonial-slider-2').length > 0) {
        const testimonialSlider2 = new Swiper(".testimonial-slider-2", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".array-next",
                prevEl: ".array-prev",
            },
            pagination: {
                el: ".dot",
                clickable: true,
            },
        });
    }

    if ($('.testimonial-slider-3').length > 0) {
        const testimonialSlider3 = new Swiper(".testimonial-slider-3", {
            spaceBetween: 30,
            freeMode: true,
            centeredSlides: true,
            loop: true,
            speed: 4000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: true,
            },
            breakpoints: {
                1399: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 1.2,
                },
                575: {
                    slidesPerView: 1.2,
                },

                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    if ($('.testimonial-slider-5').length > 0) {
        const testimonialSlider5 = new Swiper(".testimonial-slider-5", {
            spaceBetween: 30,
            speed: 1300,
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: ".array-next",
                prevEl: ".array-prev",
            },
        });
    }

    $(".option").on("click", function() {
        $(".option").removeClass("active");
        $(this).addClass("active");
    });


    if ($('.testimonial-slider-4').length > 0) {
        const testimonialSlider4 = new Swiper(".testimonial-slider-4", {
            spaceBetween: 30,
            freeMode: true,
            centeredSlides: true,
            loop: true,
            speed: 4000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: true,
                reverseDirection: true,
            },
            breakpoints: {
                1399: {
                    slidesPerView: 3,
                },
                991: {
                    slidesPerView: 2,
                },
                767: {
                    slidesPerView: 1.2,
                },
                575: {
                    slidesPerView: 1.2,
                },

                0: {
                    slidesPerView: 1,
                },
            },
        });
    }

    /* ================================
      Services Accordion Js Start
    ================================ */

    // Service accordion - toggle only CSS classes, CSS handles the height
    document.addEventListener('DOMContentLoaded', function() {
        var serviceAccordions = document.querySelectorAll('.service-block-four .inner-box');

        serviceAccordions.forEach(function(accordion) {
            var header = accordion.querySelector('.title-box');
            if (!header) return;

            header.addEventListener('click', function() {
                var isActive = accordion.classList.contains('active');

                // Close all
                serviceAccordions.forEach(function(item) {
                    item.classList.remove('active');
                });

                // Open clicked if it was not active
                if (!isActive) {
                    accordion.classList.add('active');
                }
            });
        });
    });

    /* ================================
        Mouse Cursor Animation Js Start
    ================================ */

    if ($(".mouseCursor").length > 0) {
        function itCursor() {
            var myCursor = jQuery(".mouseCursor");
            if (myCursor.length) {
                if ($("body")) {
                    const e = document.querySelector(".cursor-inner"),
                        t = document.querySelector(".cursor-outer");
                    let n, i = 0,
                        o = !1;
                    window.onmousemove = function(s) {
                        if (!o) {
                            t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        }
                        e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        n = s.clientY;
                        i = s.clientX;
                    };
                    $("body").on("mouseenter", "button, a, .cursor-pointer", function() {
                        e.classList.add("cursor-hover");
                        t.classList.add("cursor-hover");
                    });
                    $("body").on("mouseleave", "button, a, .cursor-pointer", function() {
                        if (!($(this).is("a", "button") && $(this).closest(".cursor-pointer").length)) {
                            e.classList.remove("cursor-hover");
                            t.classList.remove("cursor-hover");
                        }
                    });
                    e.style.visibility = "visible";
                    t.style.visibility = "visible";
                }
            }
        }
        itCursor();
    }

    const awardBlocks = document.querySelectorAll(".award-block-four");

    function followImageCursor(event, parent) {
        const innerBox = parent.querySelector(".inner-box");
        if (!innerBox) return;

        const rect = innerBox.getBoundingClientRect();
        const dx = event.clientX - rect.left;
        const dy = event.clientY - rect.top;

        const targetImage = innerBox.querySelector(".hover-image");

        if (targetImage) {
            targetImage.style.transform = `translate(${dx}px, ${dy}px) rotate(15deg)`;
        }
    }

    /* Throttle (60fps) */
    function throttle(fn, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    awardBlocks.forEach((block) => {
        block.addEventListener(
            "mousemove",
            throttle((e) => {
                followImageCursor(e, block);
            }, 16)
        );
    });


    document.addEventListener('DOMContentLoaded', function() {

        const amountWrapper = document.querySelector('.amount-selection');
        const amountInput = document.getElementById('selected-amount');

        if (!amountWrapper || !amountInput) return;

        amountWrapper.addEventListener('click', function(e) {
            const item = e.target.closest('.amount-item');
            if (!item) return;

            // remove previous active
            const activeItem = amountWrapper.querySelector('.amount-item.active');
            if (activeItem) {
                activeItem.classList.remove('active');
            }

            // add active
            item.classList.add('active');

            // update input value
            const amount = item.getAttribute('data-amount');
            if (amount) {
                amountInput.value = amount;
            } else {
                amountInput.value = '';
                amountInput.focus();
            }
        });

    });


    /* ================================
        Back To Top Button Js Start
    ================================ */
    $(window).on('scroll', function() {
        if (
            $(this).scrollTop() + $(this).height() >= $(document).height() - 10
        ) {
            $('#back-top').addClass('show');
        } else {
            $('#back-top').removeClass('show');
        }
    });

    $(document).on('click', '#back-top', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    });




    if ($('.price-range-slider').length) {
        $(".price-range-slider").slider({
            range: "min",
            min: 100,
            max: 2000,
            value: 1000,
            slide: function(event, ui) {

                // show value text
                $('.property-output').text(ui.value + " sq. ft.");
            }
        });

        // initial text
        $('.property-output').text($(".price-range-slider").slider("value") + " sq. ft.");
    }


    //MixItup Gallery
    if ($(".filter-list").length) {
        $(".filter-list").mixItUp({});
    }

    //Jquery Knob animation  // Pie Chart Animation
    if ($(".dial").length) {
        $(".dial").appear(
            function() {
                var elm = $(this);
                var color = elm.attr("data-fgColor");
                var perc = elm.attr("value");

                elm.knob({
                    value: 0,
                    min: 0,
                    max: 100,
                    skin: "tron",
                    readOnly: true,
                    thickness: 0.15,
                    dynamicDraw: true,
                    displayInput: false,
                });
                $({
                    value: 0
                }).animate({
                    value: perc
                }, {
                    duration: 2000,
                    easing: "swing",
                    progress: function() {
                        elm.val(Math.ceil(this.value)).trigger("change");
                    },
                });
                //circular progress bar color
                $(this).append(function() {
                    // elm.parent().parent().find('.circular-bar-content').css('color',color);
                    //elm.parent().parent().find('.circular-bar-content .txt').text(perc);
                });
            }, {
                accY: 20
            }
        );
    }

    if ($(".tabs-box").length) {
        $(".tabs-box .tab-buttons .tab-btn").on("click", function(e) {
            e.preventDefault();
            var target = $($(this).attr("data-tab"));

            if ($(target).is(":visible")) {
                return false;
            } else {
                target.parents(".tabs-box").find(".tab-buttons").find(".tab-btn").removeClass("active-btn");
                $(this).addClass("active-btn");
                target.parents(".tabs-box").find(".tabs-content").find(".tab").fadeOut(0);
                target.parents(".tabs-box").find(".tabs-content").find(".tab").removeClass("active-tab animated fadeIn");
                $(target).fadeIn(300);
                $(target).addClass("active-tab animated fadeIn");
            }
        });
    }

    //Progress Bar
    if ($(".progress-line").length) {
        $(".progress-line").appear(
            function() {
                var el = $(this);
                var percent = el.data("width");
                $(el).css("width", percent + "%");
            }, {
                accY: 0
            }
        );
    }

    //Accordion Box
    var $faqItems = $(".faq-block-one, .faq-block-two");

    if (!$faqItems.length) return;

    // 🔥 Page Load - Active item open
    $faqItems.filter(".active").each(function() {
        var $this = $(this);
        $this.find(".content-box").show();
        $this.find(".icon i")
            .removeClass("fa-plus")
            .addClass("fa-minus");
    });

    // 🔥 Event Delegation (Better Practice)
    $(document).on("click", ".title-box", function() {

        var $parent = $(this).closest(".faq-block-one, .faq-block-two");

        if ($parent.hasClass("active")) {

            $parent.removeClass("active")
                .find(".content-box")
                .stop(true, true)
                .slideUp(300);

            $parent.find(".icon i")
                .removeClass("fa-minus")
                .addClass("fa-plus");

        } else {

            // Close all
            $faqItems.removeClass("active")
                .find(".content-box")
                .stop(true, true)
                .slideUp(300);

            $faqItems.find(".icon i")
                .removeClass("fa-minus")
                .addClass("fa-plus");

            // Open current
            $parent.addClass("active")
                .find(".content-box")
                .stop(true, true)
                .slideDown(300);

            $parent.find(".icon i")
                .removeClass("fa-plus")
                .addClass("fa-minus");
        }
    });




    $(document).ready(function() {
        $("select").niceSelect();
    });

    //>> Video Popup Start <<//
    $(".img-popup").magnificPopup({
        type: "image",
        gallery: {
            enabled: true,
        },
    });

    $('.video-popup').magnificPopup({
        type: 'iframe',
        callbacks: {}
    });

    // Elements Animation
    if ($('.wow').length) {
        var wow = new WOW({
            boxClass: 'wow', // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 0, // distance to the element when triggering the animation (default is 0)
            mobile: false, // trigger animations on mobile devices (default is true)
            live: true // act on asynchronously loaded content (default is true)
        });
        wow.init();
    }


    /* ================================
    Project Slider Js Start
    ================================ */





})(window.jQuery);