/**
 * =====================================================
 * COUNTDOWN.JS
 * Birthday Countdown Module
 * =====================================================
 */

"use strict";

/**
 * =====================================================
 * DOM ELEMENTS
 * =====================================================
 */

const CountdownElements = {

    days:
        document.getElementById("days"),

    hours:
        document.getElementById("hours"),

    minutes:
        document.getElementById("minutes"),

    seconds:
        document.getElementById("seconds")

};

/**
 * =====================================================
 * MODULE STATE
 * =====================================================
 */

let countdownInterval = null;

/**
 * =====================================================
 * FORMAT NUMBER
 * =====================================================
 */

function formatNumber(value) {

    return String(value)
        .padStart(2, "0");
}

/**
 * =====================================================
 * UPDATE DOM
 * =====================================================
 */

function updateCountdownUI(
    days,
    hours,
    minutes,
    seconds
) {

    if (
        !CountdownElements.days ||
        !CountdownElements.hours ||
        !CountdownElements.minutes ||
        !CountdownElements.seconds
    ) {
        return;
    }

    CountdownElements.days.textContent =
        formatNumber(days);

    CountdownElements.hours.textContent =
        formatNumber(hours);

    CountdownElements.minutes.textContent =
        formatNumber(minutes);

    CountdownElements.seconds.textContent =
        formatNumber(seconds);
}

/**
 * =====================================================
 * CALCULATE TIME DIFFERENCE
 * =====================================================
 */

function calculateRemainingTime(
    targetDate
) {

    const now =
        new Date().getTime();

    const target =
        new Date(targetDate).getTime();

    const difference =
        target - now;

    if (difference <= 0) {

        return {

            expired: true,

            days: 0,

            hours: 0,

            minutes: 0,

            seconds: 0
        };
    }

    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );

    const minutes =
        Math.floor(
            (
                difference %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );

    const seconds =
        Math.floor(
            (
                difference %
                (1000 * 60)
            ) /
            1000
        );

    return {

        expired: false,

        days,

        hours,

        minutes,

        seconds
    };
}

/**
 * =====================================================
 * BIRTHDAY REACHED
 * =====================================================
 */

function handleBirthdayReached() {

    clearInterval(
        countdownInterval
    );

    updateCountdownUI(
        0,
        0,
        0,
        0
    );

    console.log(
        "🎂 Happy Birthday!"
    );

    const heroTitle =
        document.querySelector(
            ".hero-title"
        );

    if (heroTitle) {

        heroTitle.textContent =
            "🎉 Happy Birthday 🎉";
    }

    triggerBirthdayEffect();
}

/**
 * =====================================================
 * OPTIONAL CELEBRATION EFFECT
 * =====================================================
 */

function triggerBirthdayEffect() {

    document.body.classList.add(
        "birthday-mode"
    );

    const heartCount = 20;

    for (
        let i = 0;
        i < heartCount;
        i++
    ) {

        createFloatingHeart();
    }
}

/**
 * =====================================================
 * FLOATING HEART
 * =====================================================
 */

function createFloatingHeart() {

    const heart =
        document.createElement(
            "div"
        );

    heart.className =
        "floating-heart";

    heart.innerHTML = "❤";

    heart.style.left =
        Math.random() * 100 + "%";

    heart.style.animationDuration =
        3 +
        Math.random() * 4 +
        "s";

    heart.style.fontSize =
        18 +
        Math.random() * 24 +
        "px";

    document.body.appendChild(
        heart
    );

    setTimeout(() => {

        heart.remove();

    }, 8000);
}

/**
 * =====================================================
 * START COUNTDOWN
 * =====================================================
 */

function startCountdown(
    targetDate
) {

    if (!targetDate) {

        console.error(
            "Countdown target date not found."
        );

        return;
    }

    const update = () => {

        const remaining =
            calculateRemainingTime(
                targetDate
            );

        updateCountdownUI(
            remaining.days,
            remaining.hours,
            remaining.minutes,
            remaining.seconds
        );

        if (
            remaining.expired
        ) {

            handleBirthdayReached();
        }
    };

    update();

    countdownInterval =
        setInterval(
            update,
            1000
        );
}

/**
 * =====================================================
 * PUBLIC INITIALIZER
 * =====================================================
 */

function initializeCountdown(
    targetDate
) {

    console.log(
        "⏳ Countdown Initialized"
    );

    startCountdown(
        targetDate
    );
}

/**
 * =====================================================
 * MANUAL RESET
 * =====================================================
 */

function resetCountdown(
    targetDate
) {

    clearInterval(
        countdownInterval
    );

    startCountdown(
        targetDate
    );
}

/**
 * =====================================================
 * GLOBAL EXPORT
 * =====================================================
 */

window.initializeCountdown =
    initializeCountdown;

window.resetCountdown =
    resetCountdown;