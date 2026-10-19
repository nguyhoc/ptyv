/**
 * =====================================================
 * MUSIC.JS
 * Background Music Controller
 * =====================================================
 */

"use strict";

/**
 * =====================================================
 * MODULE STATE
 * =====================================================
 */

const MusicState = {

    audio: null,

    initialized: false,

    playing: false,

    config: null

};

/**
 * =====================================================
 * DOM ELEMENTS
 * =====================================================
 */

const MusicElements = {

    button:
        document.getElementById(
            "music-toggle"
        ),

    icon:
        document.querySelector(
            "#music-toggle .music-icon"
        )

};

/**
 * =====================================================
 * CREATE AUDIO ELEMENT
 * =====================================================
 */

function createAudio(config) {

    const audio =
        new Audio(config.file);

    audio.loop =
        config.loop ?? true;

    audio.volume =
        config.volume ?? 0.5;

    audio.preload =
        "auto";

    return audio;
}

/**
 * =====================================================
 * UPDATE UI
 * =====================================================
 */

function updateMusicUI() {

    if (
        !MusicElements.button ||
        !MusicElements.icon
    ) {
        return;
    }

    if (MusicState.playing) {

        MusicElements.button
            .classList.add(
                "playing"
            );

        MusicElements.button
            .setAttribute(
                "aria-label",
                "Pause Music"
            );

        MusicElements.icon.textContent =
            "🎵";

    } else {

        MusicElements.button
            .classList.remove(
                "playing"
            );

        MusicElements.button
            .setAttribute(
                "aria-label",
                "Play Music"
            );

        MusicElements.icon.textContent =
            "🔇";
    }
}

/**
 * =====================================================
 * SAVE STATE
 * =====================================================
 */

function saveMusicState() {

    localStorage.setItem(
        "birthday_music_playing",
        MusicState.playing
    );
}

/**
 * =====================================================
 * LOAD STATE
 * =====================================================
 */

function loadMusicState() {

    return (
        localStorage.getItem(
            "birthday_music_playing"
        ) === "true"
    );
}

/**
 * =====================================================
 * PLAY MUSIC
 * =====================================================
 */

async function playMusic() {

    if (!MusicState.audio) {
        return;
    }

    try {

        await MusicState.audio.play();

        MusicState.playing = true;

        updateMusicUI();

        saveMusicState();

        console.log(
            "🎵 Music Playing"
        );

    } catch (error) {

        console.warn(
            "Autoplay blocked by browser:",
            error
        );
    }
}

/**
 * =====================================================
 * PAUSE MUSIC
 * =====================================================
 */

function pauseMusic() {

    if (!MusicState.audio) {
        return;
    }

    MusicState.audio.pause();

    MusicState.playing = false;

    updateMusicUI();

    saveMusicState();

    console.log(
        "⏸ Music Paused"
    );
}

/**
 * =====================================================
 * TOGGLE MUSIC
 * =====================================================
 */

function toggleMusic() {

    if (
        MusicState.playing
    ) {

        pauseMusic();

    } else {

        playMusic();
    }
}

/**
 * =====================================================
 * USER FIRST INTERACTION
 * =====================================================
 */

function enableAudioOnInteraction() {

    const startAudio = () => {

        const rememberedState =
            loadMusicState();

        if (
            rememberedState &&
            !MusicState.playing
        ) {

            playMusic();
        }

        document.removeEventListener(
            "click",
            startAudio
        );

        document.removeEventListener(
            "touchstart",
            startAudio
        );

        document.removeEventListener(
            "keydown",
            startAudio
        );
    };

    document.addEventListener(
        "click",
        startAudio,
        {
            once: true
        }
    );

    document.addEventListener(
        "touchstart",
        startAudio,
        {
            once: true
        }
    );

    document.addEventListener(
        "keydown",
        startAudio,
        {
            once: true
        }
    );
}

/**
 * =====================================================
 * AUTOPLAY IF ALLOWED
 * =====================================================
 */

function tryAutoPlay(config) {

    if (
        !config.autoplay
    ) {
        return;
    }

    playMusic();
}

/**
 * =====================================================
 * BIND EVENTS
 * =====================================================
 */

function bindEvents() {

    MusicElements.button
        ?.addEventListener(
            "click",
            toggleMusic
        );

    MusicState.audio
        ?.addEventListener(
            "ended",
            () => {

                if (
                    MusicState.config?.loop
                ) {
                    playMusic();
                }
            }
        );
}

/**
 * =====================================================
 * SET INITIAL ICON
 * =====================================================
 */

function setInitialState() {

    MusicState.playing =
        false;

    updateMusicUI();
}

/**
 * =====================================================
 * INITIALIZER
 * =====================================================
 */

function initializeMusic(
    config = {}
) {

    if (
        MusicState.initialized
    ) {
        return;
    }

    if (
        !config.enabled
    ) {

        console.log(
            "🔇 Music Disabled"
        );

        return;
    }

    MusicState.config =
        config;

    MusicState.audio =
        createAudio(config);

    setInitialState();

    bindEvents();

    enableAudioOnInteraction();

    tryAutoPlay(config);

    MusicState.initialized =
        true;

    console.log(
        "🎶 Music Module Initialized"
    );
}

/**
 * =====================================================
 * PUBLIC METHODS
 * =====================================================
 */

function setVolume(volume) {

    if (
        !MusicState.audio
    ) {
        return;
    }

    const safeVolume =
        Math.min(
            Math.max(volume, 0),
            1
        );

    MusicState.audio.volume =
        safeVolume;
}

function getVolume() {

    return (
        MusicState.audio?.volume ??
        0
    );
}

function isMusicPlaying() {

    return MusicState.playing;
}

/**
 * =====================================================
 * GLOBAL EXPORT
 * =====================================================
 */

window.initializeMusic =
    initializeMusic;

window.playMusic =
    playMusic;

window.pauseMusic =
    pauseMusic;

window.toggleMusic =
    toggleMusic;

window.setMusicVolume =
    setVolume;

window.getMusicVolume =
    getVolume;

window.isMusicPlaying =
    isMusicPlaying;