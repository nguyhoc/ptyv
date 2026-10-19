/**
 * =====================================================
 * SCROLL.JS
 * Scroll Controller
 * =====================================================
 */

"use strict";

/**
 * =====================================================
 * CONFIG
 * =====================================================
 */

const ScrollConfig = {

    showBackToTopAt: 400,

    smoothScrollOffset: 0,

    throttleDelay: 16

};

/**
 * =====================================================
 * DOM ELEMENTS
 * =====================================================
 */

const ScrollElements = {

    progressBar:
        document.getElementById(
            "scroll-progress"
        ),

    backToTop:
        document.getElementById(
            "back-to-top"
        )

};

/**
 * =====================================================
 * MODULE STATE
 * =====================================================
 */

const ScrollState = {

    ticking: false,

    initialized: false

};

/**
 * =====================================================
 * GET SCROLL INFO
 * =====================================================
 */

function getScrollData() {

    const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;

    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const percentage =
        documentHeight > 0
            ? (scrollTop / documentHeight) * 100
            : 0;

    return {

        scrollTop,

        documentHeight,

        percentage
    };
}

/**
 * =====================================================
 * UPDATE PROGRESS BAR
 * =====================================================
 */

function updateProgressBar() {

    if (
        !ScrollElements.progressBar
    ) {
        return;
    }

    const {
        percentage
    } = getScrollData();

    ScrollElements.progressBar.style.width =
        `${percentage}%`;
}

/**
 * =====================================================
 * BACK TO TOP VISIBILITY
 * =====================================================
 */

function updateBackToTopButton() {

    if (
        !ScrollElements.backToTop
    ) {
        return;
    }

    const {
        scrollTop
    } = getScrollData();

    if (
        scrollTop >
        ScrollConfig.showBackToTopAt
    ) {

        ScrollElements.backToTop
            .classList.add(
                "show"
            );

    } else {

        ScrollElements.backToTop
            .classList.remove(
                "show"
            );
    }
}

/**
 * =====================================================
 * SCROLL TO TOP
 * =====================================================
 */

function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"
    });
}

/**
 * =====================================================
 * SMOOTH ANCHOR SCROLL
 * =====================================================
 */

function initializeSmoothScroll() {

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    anchorLinks.forEach(
        link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    const targetPosition =
                        target.offsetTop -
                        ScrollConfig.smoothScrollOffset;

                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"
                    });
                }
            );
        }
    );
}

/**
 * =====================================================
 * ACTIVE SECTION TRACKER
 * =====================================================
 */

function initializeSectionTracker() {

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    if (
        !sections.length
    ) {
        return;
    }

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            document.body.dataset.section =
                                entry.target.id;
                        }
                    }
                );
            },

            {
                threshold: 0.35
            }
        );

    sections.forEach(
        section => {

            observer.observe(
                section
            );
        }
    );
}

/**
 * =====================================================
 * PARALLAX SCROLL
 * =====================================================
 */

function isMobileScrollScreen() {

    return (
        window.matchMedia(
            "(max-width: 768px)"
        ).matches ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
        )
    );
}

function initializeScrollParallax() {

    if (isMobileScrollScreen()) {
        return;
    }

    const hero =
        document.getElementById(
            "hero"
        );

    if (!hero) return;

    window.addEventListener(
        "scroll",
        () => {

            const scrollY =
                window.scrollY;

            hero.style.backgroundPositionY =
                `${scrollY * 0.4}px`;
        }
    );
}

/**
 * =====================================================
 * THROTTLED SCROLL UPDATE
 * =====================================================
 */

function handleScroll() {

    if (
        ScrollState.ticking
    ) {
        return;
    }

    ScrollState.ticking = true;

    requestAnimationFrame(
        () => {

            updateProgressBar();

            updateBackToTopButton();

            ScrollState.ticking = false;
        }
    );
}

/**
 * =====================================================
 * BIND EVENTS
 * =====================================================
 */

function bindEvents() {

    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );

    ScrollElements.backToTop
        ?.addEventListener(
            "click",
            scrollToTop
        );
}

/**
 * =====================================================
 * INITIAL UPDATE
 * =====================================================
 */

function initialRender() {

    updateProgressBar();

    updateBackToTopButton();
}

/**
 * =====================================================
 * INITIALIZER
 * =====================================================
 */

function initializeScroll() {

    if (
        ScrollState.initialized
    ) {
        return;
    }

    initializeSmoothScroll();

    initializeSectionTracker();

    initializeScrollParallax();

    bindEvents();

    initialRender();

    ScrollState.initialized =
        true;

    console.log(
        "📜 Scroll Module Initialized"
    );
}

/**
 * =====================================================
 * PUBLIC METHODS
 * =====================================================
 */

function getScrollPercentage() {

    return getScrollData()
        .percentage;
}

function getCurrentScrollPosition() {

    return getScrollData()
        .scrollTop;
}

/**
 * =====================================================
 * GLOBAL EXPORT
 * =====================================================
 */

window.initializeScroll =
    initializeScroll;

window.getScrollPercentage =
    getScrollPercentage;

window.getCurrentScrollPosition =
    getCurrentScrollPosition;