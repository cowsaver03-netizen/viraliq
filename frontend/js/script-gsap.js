(function($) {
    'use strict';

    /* ================================
       Smooth Scroller And Title Animation Js Start
    ================================ */
    if ($('#smooth-wrapper').length && $('#smooth-content').length) {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

        gsap.config({
            nullTargetWarn: false,
        });

        var isTouchDevice = ScrollTrigger.isTouch === 1 || window.matchMedia('(max-width: 991px)').matches;

        ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: isTouchDevice ? 0.8 : 1.2,
            effects: !isTouchDevice,
            smoothTouch: isTouchDevice ? 0 : 0.08,
            normalizeScroll: true,
            ignoreMobileResize: true,
        });
    }

    /* ================================
       Text Anim Js Start
    ================================ */

    /* ================================
         Text Title Animation Js Start
      ================================ */

    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        let mm = gsap.matchMedia();

        mm.add("(min-width: 1200px)", () => {

            let splits = [];

            // ===== tz-sub-tilte =====
            $('.tz-sub-tilte').each(function(index, el) {

                let split = new SplitText(el, {
                    type: "lines,words,chars",
                    linesClass: "split-line"
                });

                splits.push(split);

                gsap.set(split.chars, {
                    opacity: 0,
                    x: 7
                });

                gsap.to(split.chars, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        end: "top 60%",
                        scrub: 1
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.2
                });
            });

            // ===== tz-itm-title =====
            $('.tz-itm-title').each(function(index, el) {

                let split = new SplitText(el, {
                    type: "lines,words,chars",
                    linesClass: "split-line"
                });

                splits.push(split);

                gsap.set(split.chars, {
                    opacity: 0.3,
                    x: -7
                });

                gsap.to(split.chars, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 92%",
                        end: "top 60%",
                        scrub: 1
                    },
                    x: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.2
                });
            });

            // 🔥 MOST IMPORTANT PART
            ScrollTrigger.refresh();

            // 🔥 cleanup on breakpoint change
            return () => {
                splits.forEach(split => split.revert());
                ScrollTrigger.getAll().forEach(st => st.kill());
            };

        });
    }

    if ($('.char-animation').length > 0) {
        let char_come = gsap.utils.toArray(".char-animation");
        char_come.forEach(splitTextLine => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: splitTextLine,
                    start: 'top 90%',
                    end: 'bottom 60%',
                    scrub: false,
                    markers: false,
                    toggleActions: 'play none none none'

                }
            });

            const itemSplitted = new SplitText(splitTextLine, {
                type: "chars, words"
            });
            gsap.set(splitTextLine, {
                perspective: 300
            });
            itemSplitted.split({
                type: "chars, words"
            })
            tl.from(itemSplitted.chars, {
                duration: 1,
                delay: 0.5,
                x: 100,
                autoAlpha: 0,
                stagger: 0.05
            });
        });
    }

    /* ================================
       Service Panel Js Start
    ================================ */


    gsap.utils.toArray('.tm-gsap-animate-circle').forEach((el, index) => {
        let arspin = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                scrub: 1,
                start: "top 100%",
                end: "top -50%",
                toggleActions: "play none none reverse",
                markers: false
            }
        })

        arspin
            .set(el, {
                transformOrigin: 'center center'
            })
            .fromTo(el, {
                rotate: 0
            }, {
                rotate: 180,
                duration: 2,
                immediateRender: false
            })
    });

    /* ================================
       Service Panel Js Start
    ================================ */


    if (document.querySelector(".des-portfolio-wrap")) {
        const pr = ScrollTrigger.matchMedia();

        pr.add("(min-width: 1199px)", () => {

            const sections = document.querySelectorAll(".des-portfolio-panel");
            const wrap = document.querySelector(".des-portfolio-wrap");

            if (!sections.length || !wrap) return;

            // Initial state
            gsap.set(sections, {
                scale: 1
            });

            // Animate each section except the last one
            sections.forEach((section, index) => {
                const isLast = index === sections.length - 1;

                gsap.to(section, {
                    scale: isLast ? 1 : 0.8, // 👈 last one stays full-size
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 4%",
                        end: "bottom 65%",
                        scrub: true,
                        pin: true,
                        pinSpacing: false,
                        endTrigger: wrap,
                        markers: false,
                    },
                });
            });

            // Cleanup on condition change
            return () => {
                ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
            };
        });
    }

    gsap.registerPlugin(ScrollTrigger);

    let mm = gsap.matchMedia();

    mm.add("(min-width: 1200px)", () => {

        document.querySelectorAll(".scale-up-img").forEach((section) => {

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom center",
                    scrub: 1,
                    markers: false,
                }
            });

            tl.to(section.querySelector(".scale-up"), {
                scale: 1.15,
                duration: 1,
                ease: "none"
            });

        });

    });

    // text-scale-anim
    function initTextScaleAnim() {
        const headings = document.querySelectorAll(".text-scale-anim");

        headings.forEach((heading) => {
            if (heading.dataset.processed) return;
            heading.dataset.processed = "true";

            const textNodes = [];

            heading.childNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.textContent.trim().split(" ").forEach((word, index, array) => {
                        const wordSpan = document.createElement("span");
                        wordSpan.classList.add("tp-word-span");

                        word.split("").forEach((letter) => {
                            const letterSpan = document.createElement("span");
                            letterSpan.classList.add("tp-letter-span");
                            letterSpan.textContent = letter;
                            wordSpan.appendChild(letterSpan);
                        });

                        textNodes.push(wordSpan);
                        if (index < array.length - 1) {
                            textNodes.push(document.createTextNode(" "));
                        }
                    });
                }
            });

            heading.innerHTML = "";
            textNodes.forEach((node) => heading.appendChild(node));
        });

        document.querySelectorAll(".tp-letter-span").forEach((letter) => {
            letter.addEventListener("mouseenter", () => {
                gsap.to(letter, {
                    scaleY: 1.3,
                    y: "-14%",
                    duration: 0.2,
                    ease: "sine",
                });
            });

            letter.addEventListener("mouseleave", () => {
                gsap.to(letter, {
                    scaleY: 1,
                    y: "0%",
                    duration: 0.2,
                    ease: "sine",
                });
            });
        });
    }

    /* ========= XL ONLY ========= */
    const xlMedia = window.matchMedia("(min-width: 1200px)");

    function handleXL(e) {
        if (e.matches) {
            initTextScaleAnim();
        }
    }

    handleXL(xlMedia);
    xlMedia.addEventListener("change", handleXL);

    /* ================================
        Project Content Move Js Start
       ================================ */

    const speed = 0.08; // slower = smoother

    $('.project-block-four').each(function() {
        const $item = $(this);
        const $content = $item.find('.content-block');

        let mouseX = 0,
            mouseY = 0,
            currentX = 0,
            currentY = 0,
            isHover = false;

        function animate() {
            // Only animate if hovering
            if (isHover) {
                currentX += (mouseX - currentX) * speed;
                currentY += (mouseY - currentY) * speed;

                $content.css(
                    'transform',
                    `translate3d(${currentX}px, ${currentY}px, 0)`
                );
            }

            requestAnimationFrame(animate);
        }

        animate();

        $item.on('mouseenter', function(e) {
            isHover = true;
            // Remove snapping — start from current position
            const rect = this.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        $item.on('mousemove', function(e) {
            if (!isHover) return;
            const rect = this.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        $item.on('mouseleave', function() {
            isHover = false;
            mouseX = 0;
            mouseY = 0;
            currentX = 0;
            currentY = 0;

            $content.css('transform', 'translate3d(0,0,0)');
        });
    });

    document.addEventListener("DOMContentLoaded", function() {
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);

            ScrollTrigger.matchMedia({
                "(min-width: 1200px)": function() {
                    const animations = [{
                        selector: ".get-in-texts",
                        x: 200
                    }, ];

                    animations.forEach(anim => {
                        const elements = document.querySelectorAll(anim.selector);
                        if (elements.length) {
                            elements.forEach(el => {
                                gsap.to(el, {
                                    x: anim.x,
                                    ease: "none",
                                    scrollTrigger: {
                                        trigger: el,
                                        start: "top bottom",
                                        end: "top top",
                                        scrub: true,
                                    },
                                });
                            });
                        }
                    });
                }
            });
        }
    });

    /* ================================
        Button Hover Js Start
       ================================ */

    if (typeof gsap !== "undefined") {
        const hoverBtns = gsap.utils.toArray(".wt-hover-btn-wrapper");
        const hoverBtnItems = gsap.utils.toArray(".wt-hover-btn-item");

        if (hoverBtns.length && hoverBtnItems.length) {
            hoverBtns.forEach((btn, i) => {
                const $btn = $(btn);

                $btn.on("mousemove", function(e) {
                    const relX = e.pageX - $btn.offset().left;
                    const relY = e.pageY - $btn.offset().top;

                    gsap.to(hoverBtnItems[i], {
                        duration: 0.6,
                        x: ((relX - $btn.width() / 2) / $btn.width()) * 60,
                        y: ((relY - $btn.height() / 2) / $btn.height()) * 60,
                        ease: "power2.out"
                    });
                });

                $btn.on("mouseleave", function() {
                    gsap.to(hoverBtnItems[i], {
                        duration: 0.6,
                        x: 0,
                        y: 0,
                        ease: "power2.out"
                    });
                });
            });
        }
    }

    document.querySelectorAll('.award-block-three .inner-box').forEach((box) => {
        const hoverImg = box.querySelector('.hover-image');
        let mouseX = 0;
        let mouseY = 0;
        let isHovering = false;

        box.addEventListener('mouseenter', () => {
            isHovering = true;
            hoverImg.style.opacity = '1';
            hoverImg.style.visibility = 'visible';
        });

        box.addEventListener('mouseleave', () => {
            isHovering = false;
            hoverImg.style.opacity = '0';
            hoverImg.style.visibility = 'hidden';
        });

        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        function animate() {
            if (isHovering) {
                hoverImg.style.transform = `translate(${mouseX}px, ${mouseY}px) rotate(15deg)`;
            }
            requestAnimationFrame(animate);
        }

        animate();
    });



})(jQuery);