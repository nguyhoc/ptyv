/**
 * =====================================================
 * ANIMATIONS.JS
 * Scroll Reveal & Animation Controller
 * =====================================================
 */

"use strict";

/**
 * =====================================================
 * CONFIG
 * =====================================================
 */

const AnimationConfig = {

    threshold: 0.15,

    rootMargin: "0px 0px -100px 0px",

    staggerDelay: 120

};

/**
 * =====================================================
 * MODULE STATE
 * =====================================================
 */

const AnimationState = {

    observer: null,

    initialized: false

};

/**
 * =====================================================
 * MOBILE DETECTION
 * =====================================================
 */

function isMobileAnimationScreen() {

    return (
        window.matchMedia("(max-width: 768px)").matches ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
}

/**
 * =====================================================
 * ELEMENT SELECTORS
 * =====================================================
 */

const RevealSelectors = [

    ".reveal",

    ".reveal-left",

    ".reveal-right",

    ".reveal-zoom"

];

/**
 * =====================================================
 * GET ALL REVEAL ELEMENTS
 * =====================================================
 */

function getRevealElements() {

    return document.querySelectorAll(
        RevealSelectors.join(",")
    );
}

/**
 * =====================================================
 * ADD ACTIVE CLASS
 * =====================================================
 */

function revealElement(element) {

    if (
        !element ||
        element.classList.contains(
            "active"
        )
    ) {
        return;
    }

    element.classList.add(
        "active"
    );
}

/**
 * =====================================================
 * REMOVE ACTIVE CLASS
 * =====================================================
 */

function hideElement(element) {

    if (!element) return;

    element.classList.remove(
        "active"
    );
}

/**
 * =====================================================
 * INTERSECTION OBSERVER CALLBACK
 * =====================================================
 */

function handleIntersection(
    entries,
    observer
) {

    entries.forEach(entry => {

        if (
            entry.isIntersecting
        ) {

            revealElement(
                entry.target
            );

            observer.unobserve(
                entry.target
            );
        }
    });
}

/**
 * =====================================================
 * CREATE OBSERVER
 * =====================================================
 */

function createObserver() {

    return new IntersectionObserver(
        handleIntersection,
        {
            threshold:
                AnimationConfig.threshold,

            rootMargin:
                AnimationConfig.rootMargin
        }
    );
}

/**
 * =====================================================
 * OBSERVE ELEMENTS
 * =====================================================
 */

function observeElements() {

    const elements =
        getRevealElements();

    if (
        !elements.length
    ) {

        console.warn(
            "No reveal elements found."
        );

        return;
    }

    AnimationState.observer =
        createObserver();

    elements.forEach(
        element => {

            AnimationState.observer
                .observe(element);
        }
    );
}

/**
 * =====================================================
 * STAGGER ANIMATION
 * =====================================================
 */

function applyStaggerAnimation() {

    const sections =
        document.querySelectorAll(
            ".gallery-grid, .countdown-container"
        );

    sections.forEach(
        section => {

            const children =
                section.children;

            [...children].forEach(
                (
                    child,
                    index
                ) => {

                    child.style.transitionDelay =
                        `${index * AnimationConfig.staggerDelay}ms`;
                }
            );
        }
    );
}

/**
 * =====================================================
 * HERO ENTRANCE ANIMATION
 * =====================================================
 */

function initializeHeroAnimation() {

    const heroElements =
        document.querySelectorAll(
            ".hero-tag, .hero-title, .hero-subtitle, .countdown-container, .primary-button"
        );

    heroElements.forEach(
        (
            element,
            index
        ) => {

            element.style.opacity =
                "0";

            setTimeout(() => {

                element.style.opacity =
                    "1";

                element.style.transform =
                    "translateY(0)";

            }, 300 + index * 200);
        }
    );
}

/**
 * =====================================================
 * PARALLAX EFFECT
 * =====================================================
 */

function initializeParallax() {

    const hero =
        document.getElementById(
            "hero"
        );

    if (!hero || isMobileAnimationScreen()) {
        return;
    }

    window.addEventListener(
        "mousemove",
        event => {

            const x =
                (
                    event.clientX /
                    window.innerWidth
                ) -
                0.5;

            const y =
                (
                    event.clientY /
                    window.innerHeight
                ) -
                0.5;

            hero.style.transform =
                `
                translate3d(
                    ${x * 10}px,
                    ${y * 10}px,
                    0
                )
                `;
        }
    );
}

/**
 * =====================================================
 * FLOATING EFFECTS
 * =====================================================
 */

function initializeFloatingElements() {

    const floatingElements =
        document.querySelectorAll(
            ".scroll-indicator, .hero-tag"
        );

    if (isMobileAnimationScreen()) {
        return;
    }

    floatingElements.forEach(
        element => {

            element.classList.add(
                "float"
            );
        }
    );
}

/**
 * =====================================================
 * GLOW ON HOVER
 * =====================================================
 */

function initializeGlowEffects() {

    const glowElements =
        document.querySelectorAll(
            ".glass-card, .primary-button, .gallery-item"
        );

    glowElements.forEach(
        element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    element.classList.add(
                        "glow"
                    );
                }
            );

            element.addEventListener(
                "mouseleave",
                () => {

                    element.classList.remove(
                        "glow"
                    );
                }
            );
        }
    );
}

/**
 * =====================================================
 * REVEAL ALL (DEBUG)
 * =====================================================
 */

function revealAll() {

    getRevealElements()
        .forEach(
            revealElement
        );
}

/**
 * =====================================================
 * RESET ALL (DEBUG)
 * =====================================================
 */

function resetRevealAnimations() {

    getRevealElements()
        .forEach(
            hideElement
        );

    observeElements();
}

/**
 * =====================================================
 * INITIALIZER
 * =====================================================
 */

function initializeRevealAnimations() {

    if (
        AnimationState.initialized
    ) {
        return;
    }

    observeElements();

    applyStaggerAnimation();

    initializeHeroAnimation();

    initializeParallax();

    initializeFloatingElements();

    initializeGlowEffects();

    AnimationState.initialized =
        true;

    console.log(
        "✨ Reveal Animations Initialized"
    );
}

/**
 * =====================================================
 * PUBLIC API
 * =====================================================
 */

window.initializeRevealAnimations =
    initializeRevealAnimations;

window.revealAll =
    revealAll;

window.resetRevealAnimations =
    resetRevealAnimations;