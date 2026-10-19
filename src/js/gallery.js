/**
 * =====================================================
 * GALLERY.JS
 * Memory Gallery Module
 * =====================================================
 */

"use strict";

/**
 * =====================================================
 * DOM ELEMENTS
 * =====================================================
 */

const GalleryElements = {

    galleryGrid:
        document.getElementById(
            "gallery-grid"
        )

};

/**
 * =====================================================
 * MODULE STATE
 * =====================================================
 */

const GalleryState = {

    items: [],

    initialized: false

};

/**
 * =====================================================
 * RANDOM POLAROID ROTATION
 * =====================================================
 */

function getRandomRotation() {

    const rotations = [
        -4,
        -3,
        -2,
        -1,
        1,
        2,
        3,
        4
    ];

    return rotations[
        Math.floor(
            Math.random() *
            rotations.length
        )
    ];
}

/**
 * =====================================================
 * CREATE GALLERY CARD
 * =====================================================
 */

function createGalleryCard(
    item,
    index
) {

    const card =
        document.createElement(
            "article"
        );

    card.className =
        "gallery-item reveal";

    card.dataset.index =
        index;

    card.style.setProperty(
        "--rotation",
        `${getRandomRotation()}deg`
    );

    card.innerHTML = `

        <div class="gallery-polaroid">

            <img
                src="${item.image}"
                alt="${item.title}"
                class="gallery-image"
                loading="lazy"
            >

            <div class="gallery-content">

                <h3 class="gallery-title">
                    ${item.title}
                </h3>

                <p class="gallery-description">
                    ${item.description}
                </p>

            </div>

        </div>

    `;

    return card;
}

/**
 * =====================================================
 * RENDER GALLERY
 * =====================================================
 */

function renderGallery(
    galleryData
) {

    if (
        !GalleryElements.galleryGrid
    ) {
        console.error(
            "Gallery container not found."
        );

        return;
    }

    GalleryElements.galleryGrid.innerHTML =
        "";

    galleryData.forEach(
        (item, index) => {

            const card =
                createGalleryCard(
                    item,
                    index
                );

            GalleryElements.galleryGrid
                .appendChild(card);
        }
    );
}

/**
 * =====================================================
 * HOVER TILT EFFECT
 * =====================================================
 */

function isMobileGalleryScreen() {

    return (
        window.matchMedia(
            "(max-width: 768px)"
        ).matches ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
        )
    );
}

function initializeTiltEffect() {

    if (isMobileGalleryScreen()) {

        return;
    }

    const cards =
        document.querySelectorAll(
            ".gallery-item"
        );

    cards.forEach(card => {

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateY =
                    (
                        (x - centerX)
                        / centerX
                    ) * 6;

                const rotateX =
                    (
                        (centerY - y)
                        / centerY
                    ) * 6;

                card.style.transform =
                    `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(1.03)
                    `;
            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "";
            }
        );
    });
}

/**
 * =====================================================
 * LIGHTBOX
 * =====================================================
 */

function createLightbox() {

    if (
        document.getElementById(
            "gallery-lightbox"
        )
    ) {
        return;
    }

    const lightbox =
        document.createElement(
            "div"
        );

    lightbox.id =
        "gallery-lightbox";

    lightbox.innerHTML = `

        <div class="lightbox-overlay">

            <button
                class="lightbox-close"
                aria-label="Close"
            >
                ×
            </button>

            <img
                class="lightbox-image"
                src=""
                alt=""
            >

            <div
                class="lightbox-caption"
            >
            </div>

        </div>

    `;

    document.body.appendChild(
        lightbox
    );
}

/**
 * =====================================================
 * OPEN LIGHTBOX
 * =====================================================
 */

function openLightbox(
    image,
    title,
    description
) {

    const lightbox =
        document.getElementById(
            "gallery-lightbox"
        );

    if (!lightbox) return;

    const lightboxImage =
        lightbox.querySelector(
            ".lightbox-image"
        );

    const caption =
        lightbox.querySelector(
            ".lightbox-caption"
        );

    lightboxImage.src =
        image;

    lightboxImage.alt =
        title;

    caption.innerHTML = `

        <h3>${title}</h3>

        <p>${description}</p>

    `;

    lightbox.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";
}

/**
 * =====================================================
 * CLOSE LIGHTBOX
 * =====================================================
 */

function closeLightbox() {

    const lightbox =
        document.getElementById(
            "gallery-lightbox"
        );

    if (!lightbox) return;

    lightbox.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";
}

/**
 * =====================================================
 * BIND LIGHTBOX EVENTS
 * =====================================================
 */

function initializeLightbox(
    galleryData
) {

    createLightbox();

    const cards =
        document.querySelectorAll(
            ".gallery-item"
        );

    cards.forEach(
        (card, index) => {

            card.addEventListener(
                "click",
                () => {

                    const item =
                        galleryData[
                            index
                        ];

                    openLightbox(
                        item.image,
                        item.title,
                        item.description
                    );
                }
            );
        }
    );

    const lightbox =
        document.getElementById(
            "gallery-lightbox"
        );

    if (!lightbox) return;

    lightbox.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                    lightbox ||
                event.target.classList.contains(
                    "lightbox-overlay"
                ) ||
                event.target.classList.contains(
                    "lightbox-close"
                )
            ) {

                closeLightbox();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeLightbox();
            }
        }
    );
}

/**
 * =====================================================
 * PUBLIC INITIALIZER
 * =====================================================
 */

function initializeGallery(
    galleryData = []
) {

    if (
        !Array.isArray(
            galleryData
        )
    ) {

        console.error(
            "Invalid gallery data."
        );

        return;
    }

    GalleryState.items =
        galleryData;

    renderGallery(
        galleryData
    );

    initializeTiltEffect();

    initializeLightbox(
        galleryData
    );

    GalleryState.initialized =
        true;

    console.log(
        "🖼️ Gallery Initialized"
    );
}

/**
 * =====================================================
 * PUBLIC METHODS
 * =====================================================
 */

function getGalleryItems() {

    return GalleryState.items;
}

function isGalleryReady() {

    return GalleryState.initialized;
}

/**
 * =====================================================
 * GLOBAL EXPORT
 * =====================================================
 */

window.initializeGallery =
    initializeGallery;

window.getGalleryItems =
    getGalleryItems;

window.isGalleryReady =
    isGalleryReady;