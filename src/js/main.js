/**
 * =====================================================
 * MAIN.JS
 * Core Application Controller
 * =====================================================
 */

"use strict";

/**
 * =====================================================
 * GLOBAL APP STATE
 * =====================================================
 */

const App = {

    data: null,

    initialized: false

};

/**
 * =====================================================
 * DOM ELEMENTS
 * =====================================================
 */

const DOM = {

    heroTag:
        document.querySelector(".hero-tag"),

    heroTitle:
        document.querySelector(".hero-title"),

    heroSubtitle:
        document.querySelector(".hero-subtitle"),

    heroButton:
        document.querySelector(".primary-button"),

    letterTitle:
        document.querySelector(
            "#birthday-letter .section-title"
        ),

    letterDescription:
        document.querySelector(
            "#birthday-letter .section-description"
        ),

    letterContent:
        document.querySelector("#letter-content"),

    videoTitle:
        document.querySelector(
            "#video-memories .section-title"
        ),

    videoDescription:
        document.querySelector(
            "#video-memories .section-description"
        ),

    memoryVideo:
        document.querySelector("#memory-video"),

    finalTitle:
        document.querySelector(".final-title"),

    finalText:
        document.querySelector(".final-text"),

    footerTitle:
        document.querySelector(
            "#footer h3"
        ),

    footerDescription:
        document.querySelector(
            "#footer p"
        )

};

/**
 * =====================================================
 * FETCH JSON DATA
 * =====================================================
 */

async function loadContent() {

    try {

        const response = await fetch(
            "/src/data/content.json"
        );

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const data =
            await response.json();

        App.data = data;

        console.log(
            "✅ Content Loaded Successfully"
        );

        return data;

    } catch (error) {

        console.error(
            "❌ Failed To Load Content",
            error
        );

        return null;
    }
}

/**
 * =====================================================
 * HERO SECTION
 * =====================================================
 */

function renderHero(data) {

    if (!data.hero) return;

    DOM.heroTag.textContent =
        data.hero.tag;

    DOM.heroTitle.textContent =
        data.hero.title;

    DOM.heroSubtitle.textContent =
        data.hero.subtitle;

    DOM.heroButton.textContent =
        data.hero.buttonText;
}

/**
 * =====================================================
 * LETTER SECTION
 * =====================================================
 */

function renderLetter(data) {

    if (!data.letter) return;

    DOM.letterTitle.textContent =
        data.letter.sectionTitle;

    DOM.letterDescription.textContent =
        data.letter.sectionDescription;

    const letterHTML =
        data.letter.content
            .map(
                paragraph =>
                    `<p>${paragraph}</p>`
            )
            .join("<br>");

    DOM.letterContent.innerHTML =
        letterHTML;
}

/**
 * =====================================================
 * VIDEO SECTION
 * =====================================================
 */

function renderVideo(data) {

    if (!data.video) return;

    DOM.videoTitle.textContent =
        data.video.sectionTitle;

    DOM.videoDescription.textContent =
        data.video.sectionDescription;

    if (DOM.memoryVideo) {

        DOM.memoryVideo.src =
            data.video.videoPath;

        DOM.memoryVideo.poster =
            data.video.poster;
    }
}

/**
 * =====================================================
 * FINAL MESSAGE SECTION
 * =====================================================
 */

function renderFinalMessage(data) {

    if (!data.finalMessage) return;

    DOM.finalTitle.textContent =
        data.finalMessage.title;

    DOM.finalText.textContent =
        data.finalMessage.message;
}

/**
 * =====================================================
 * FOOTER
 * =====================================================
 */

function renderFooter(data) {

    if (!data.footer) return;

    DOM.footerTitle.textContent =
        data.footer.title;

    DOM.footerDescription.textContent =
        data.footer.description;
}

/**
 * =====================================================
 * DOCUMENT TITLE
 * =====================================================
 */

function updatePageMeta(data) {

    if (!data.site) return;

    document.title =
        data.site.title;

    const descriptionMeta =
        document.querySelector(
            'meta[name="description"]'
        );

    if (descriptionMeta) {

        descriptionMeta.content =
            data.site.description;
    }
}

/**
 * =====================================================
 * INITIALIZE MODULES
 * =====================================================
 */

function initializeModules() {

    /**
     * Countdown Module
     */

    if (
        typeof initializeCountdown ===
        "function"
    ) {

        initializeCountdown(
            App.data.hero.targetDate
        );
    }

    /**
     * Gallery Module
     */

    if (
        typeof initializeGallery ===
        "function"
    ) {

        initializeGallery(
            App.data.gallery
        );
    }

    /**
     * Scroll Module
     */

    if (
        typeof initializeScroll ===
        "function"
    ) {

        initializeScroll();
    }

    /**
     * Reveal Animation Module
     */

    if (
        typeof initializeRevealAnimations ===
        "function"
    ) {

        initializeRevealAnimations();
    }

    /**
     * Music Module
     */

    if (
        typeof initializeMusic ===
        "function"
    ) {

        initializeMusic(
            App.data.music
        );
    }

    /**
     * Particle Module
     */

    if (
        typeof initializeParticles ===
        "function"
    ) {

        initializeParticles(
            App.data.particles
        );
    }
}

/**
 * =====================================================
 * PAGE LOADER
 * =====================================================
 */

function hideLoader() {

    const loader =
        document.getElementById(
            "loader"
        );

    if (!loader) return;

    const duration =
        App.data?.animations
            ?.loaderDuration || 2000;

    setTimeout(() => {

        loader.classList.add(
            "hidden"
        );

    }, duration);
}

/**
 * =====================================================
 * APP INITIALIZATION
 * =====================================================
 */

async function initializeApp() {

    try {

        const data =
            await loadContent();

        if (!data) {

            throw new Error(
                "Content Not Found"
            );
        }

        renderHero(data);

        renderLetter(data);

        renderVideo(data);

        renderFinalMessage(data);

        renderFooter(data);

        updatePageMeta(data);

        initializeModules();

        hideLoader();

        App.initialized = true;

        console.log(
            "🚀 Birthday Website Ready"
        );

    } catch (error) {

        console.error(
            "❌ Application Initialization Failed",
            error
        );
    }
}

/**
 * =====================================================
 * DOM READY
 * =====================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

/**
 * =====================================================
 * GLOBAL ACCESS
 * =====================================================
 */

window.BirthdayApp = {

    getData() {

        return App.data;
    },

    isReady() {

        return App.initialized;
    }

};