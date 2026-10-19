/**
 * =====================================================
 * PARTICLES.JS
 * Canvas Particle Background System
 * =====================================================
 */

"use strict";

/**
 * =====================================================
 * MODULE STATE
 * =====================================================
 */

const ParticleState = {

    canvas: null,

    context: null,

    particles: [],

    animationId: null,

    initialized: false,

    config: null
};

/**
 * =====================================================
 * PARTICLE CLASS
 * =====================================================
 */

class Particle {

    constructor(canvas, config) {

        this.canvas = canvas;

        this.config = config;

        this.reset();
    }

    reset() {

        this.x =
            Math.random() *
            this.canvas.width;

        this.y =
            Math.random() *
            this.canvas.height;

        this.size =
            randomBetween(
                this.config.size.min,
                this.config.size.max
            );

        this.opacity =
            randomBetween(
                this.config.opacity.min,
                this.config.opacity.max
            );

        this.speedX =
            (Math.random() - 0.5) *
            this.config.speed;

        this.speedY =
            (Math.random() - 0.5) *
            this.config.speed;
    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        if (
            this.x < -20 ||
            this.x > this.canvas.width + 20 ||
            this.y < -20 ||
            this.y > this.canvas.height + 20
        ) {
            this.reset();
        }
    }

    draw(context) {

        context.beginPath();

        context.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        context.fillStyle =
            `rgba(255,255,255,${this.opacity})`;

        context.fill();
    }
}

/**
 * =====================================================
 * UTILITIES
 * =====================================================
 */

function randomBetween(min, max) {

    return (
        Math.random() *
        (max - min)
    ) + min;
}

/**
 * =====================================================
 * CANVAS SETUP
 * =====================================================
 */

function isMobileParticlesScreen() {

    return (
        window.matchMedia(
            "(max-width: 768px)"
        ).matches ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
        )
    );
}

function setupCanvas() {

    const canvas =
        document.getElementById(
            "particles-canvas"
        );

    if (!canvas) {

        console.warn(
            "Particles canvas not found."
        );

        return false;
    }

    ParticleState.canvas =
        canvas;

    ParticleState.context =
        canvas.getContext("2d");

    resizeCanvas();

    return true;
}

/**
 * =====================================================
 * RESIZE CANVAS
 * =====================================================
 */

function resizeCanvas() {

    if (
        !ParticleState.canvas
    ) {
        return;
    }

    ParticleState.canvas.width =
        window.innerWidth;

    ParticleState.canvas.height =
        window.innerHeight;
}

/**
 * =====================================================
 * CREATE PARTICLES
 * =====================================================
 */

function createParticles() {

    ParticleState.particles = [];

    const count =
        ParticleState.config.count;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        ParticleState.particles.push(

            new Particle(
                ParticleState.canvas,
                ParticleState.config
            )

        );
    }
}

/**
 * =====================================================
 * CONNECT NEARBY PARTICLES
 * =====================================================
 */

function drawConnections() {

    const ctx =
        ParticleState.context;

    const particles =
        ParticleState.particles;

    const maxDistance = 120;

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const dx =
                particles[i].x -
                particles[j].x;

            const dy =
                particles[i].y -
                particles[j].y;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (
                distance <
                maxDistance
            ) {

                const opacity =
                    1 -
                    (
                        distance /
                        maxDistance
                    );

                ctx.beginPath();

                ctx.moveTo(
                    particles[i].x,
                    particles[i].y
                );

                ctx.lineTo(
                    particles[j].x,
                    particles[j].y
                );

                ctx.strokeStyle =
                    `rgba(255,255,255,${
                        opacity * 0.15
                    })`;

                ctx.lineWidth = 1;

                ctx.stroke();
            }
        }
    }
}

/**
 * =====================================================
 * RENDER LOOP
 * =====================================================
 */

function animateParticles() {

    const ctx =
        ParticleState.context;

    const canvas =
        ParticleState.canvas;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ParticleState.particles
        .forEach(
            particle => {

                particle.update();

                particle.draw(ctx);
            }
        );

    drawConnections();

    ParticleState.animationId =
        requestAnimationFrame(
            animateParticles
        );
}

/**
 * =====================================================
 * MOUSE INTERACTION
 * =====================================================
 */

function initializeMouseEffect() {

    const mouse = {

        x: null,

        y: null,

        radius: 120
    };

    window.addEventListener(
        "mousemove",
        event => {

            mouse.x =
                event.clientX;

            mouse.y =
                event.clientY;

            ParticleState.particles
                .forEach(
                    particle => {

                        const dx =
                            particle.x -
                            mouse.x;

                        const dy =
                            particle.y -
                            mouse.y;

                        const distance =
                            Math.sqrt(
                                dx * dx +
                                dy * dy
                            );

                        if (
                            distance <
                            mouse.radius
                        ) {

                            particle.x +=
                                dx * 0.01;

                            particle.y +=
                                dy * 0.01;
                        }
                    }
                );
        }
    );
}

/**
 * =====================================================
 * DESTROY
 * =====================================================
 */

function destroyParticles() {

    if (
        ParticleState.animationId
    ) {

        cancelAnimationFrame(
            ParticleState.animationId
        );
    }

    ParticleState.particles = [];
}

/**
 * =====================================================
 * EVENTS
 * =====================================================
 */

function bindEvents() {

    window.addEventListener(
        "resize",
        () => {

            resizeCanvas();

            createParticles();
        }
    );
}

/**
 * =====================================================
 * INITIALIZER
 * =====================================================
 */

function initializeParticles(
    config = {}
) {

    if (
        ParticleState.initialized
    ) {
        return;
    }

    if (
        !config.enabled
    ) {

        console.log(
            "✨ Particles Disabled"
        );

        return;
    }

    const mobileScreen =
        isMobileParticlesScreen();

    ParticleState.config =
        mobileScreen
            ? {
                ...config,
                count: Math.min(
                    config.count || 80,
                    26
                ),
                speed: Math.max(
                    (config.speed || 0.5) * 0.7,
                    0.25
                ),
                size: {
                    min: 1,
                    max: 2
                },
                opacity: {
                    min: 0.1,
                    max: 0.45
                }
            }
            : config;

    const canvasReady =
        setupCanvas();

    if (!canvasReady) {
        return;
    }

    createParticles();

    if (!mobileScreen) {
        initializeMouseEffect();
    }

    bindEvents();

    animateParticles();

    ParticleState.initialized =
        true;

    console.log(
        "✨ Particle System Initialized"
    );
}

/**
 * =====================================================
 * PUBLIC METHODS
 * =====================================================
 */

function getParticleCount() {

    return (
        ParticleState.particles
            .length
    );
}

function restartParticles() {

    destroyParticles();

    createParticles();

    animateParticles();
}

/**
 * =====================================================
 * GLOBAL EXPORT
 * =====================================================
 */

window.initializeParticles =
    initializeParticles;

window.destroyParticles =
    destroyParticles;

window.restartParticles =
    restartParticles;

window.getParticleCount =
    getParticleCount;