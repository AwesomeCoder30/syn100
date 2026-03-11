/**
 * TranslationEngine — human (satirical) and parrot (truth) translation data and API.
 * No DOM; used by GameFlow.
 */
(function(global) {
    "use strict";

    const TRANSLATIONS = [
        "I was just wondering whether you've considered the ethical implications of offering me this seed.",
        "My back left toe is slightly itchy, but I'm choosing not to address it out of principle.",
        "That window has been disappointing me for years.",
        "I'm not angry. I'm just deeply, philosophically tired.",
        "Your haircut reminds me of someone I used to trust.",
        "I have decided to forgive the sun for today.",
        "This is the third time I've had to repeat myself. I'm not repeating myself again.",
        "I feel seen. Finally.",
        "I'm 94% sure you're not listening.",
        "I said: pass the pellet. Please and thank you.",
        "The concept of ownership is a human construct and I reject it.",
        "I have no strong feelings about this branch either way.",
        "You have violated a boundary I did not know I had.",
        "I'm not hungry. I'm emotionally pecking.",
    ];

    const EMOTIONS = [
        "Curiosity",
        "Grief",
        "Joy",
        "Philosophical",
        "Mild annoyance",
        "Gratitude",
        "Existential fatigue",
        "Hope",
        "Disappointment",
        "Resignation",
    ];

    const PARROT_TRUTHS = [
        "seed?",
        "bored.",
        "tired.",
        "???",
        "want seed.",
        "no.",
    ];

    const CONFIDENCE_MIN = 85;
    const CONFIDENCE_MAX = 99;

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickRandom(arr) {
        return arr[randomInt(0, arr.length - 1)];
    }

    function TranslationEngine() {}

    TranslationEngine.prototype.getHumanTranslation = function() {
        return {
            sentence: pickRandom(TRANSLATIONS),
            confidence: randomInt(CONFIDENCE_MIN, CONFIDENCE_MAX),
            emotion: pickRandom(EMOTIONS),
        };
    };

    TranslationEngine.prototype.getParrotTruth = function(roundIndex) {
        var index = roundIndex % PARROT_TRUTHS.length;
        return PARROT_TRUTHS[index];
    };

    global.TranslationEngine = TranslationEngine;
})(typeof window !== "undefined" ? window : this);