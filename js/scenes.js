/**
 * SceneView — DOM refs for all scenes, showScene(phase), step indicator, focus management.
 * Pure presentation; no knowledge of translation or audio.
 */
(function(global) {
    "use strict";

    var PHASES = ["intro", "record", "analyzing", "translate", "parrotTruth", "dayIntro", "ending"];

    function SceneView(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.scenes = {};
        this.stepIndicator = null;
        this.refs = {};
        if (this.container) {
            this._gatherScenes();
            this._gatherRefs();
        }
    }

    SceneView.prototype._gatherScenes = function() {
        var self = this;
        PHASES.forEach(function(phase) {
            var el = self.container.querySelector(".scene-" + phase);
            if (el) self.scenes[phase] = el;
        });
        var stepEl = this.container.querySelector(".step-indicator");
        if (stepEl) this.stepIndicator = stepEl;
    };

    SceneView.prototype._gatherRefs = function() {
        var c = this.container;
        if (!c) return;
        this.refs.btnStart = c.querySelector("[data-action='start']");
        this.refs.parrotZone = c.querySelector("[data-action='parrot-zone']");
        this.refs.btnCapture = c.querySelector("[data-action='capture']");
        this.refs.btnSeeTruth = c.querySelector("[data-action='see-truth']");
        this.refs.btnNextRound = c.querySelector("[data-action='next-round']");
        this.refs.translationText = c.querySelector("[data-translation='text']");
        this.refs.confidence = c.querySelector("[data-translation='confidence']");
        this.refs.emotionValue = c.querySelector("[data-translation='emotion-value']");
        this.refs.parrotTruthText = c.querySelector("[data-parrot-truth='text']");
        this.refs.parrotContainer = c.querySelector("[data-parrot-container]");
        this.refs.analyzerProgressFill = c.querySelector(".analyzer-progress-fill");
        this.refs.dayIntroText = c.querySelector("[data-story='day-intro']");
        this.refs.endingText = c.querySelector("[data-story='ending-text']");
        this.refs.btnContinueDay = c.querySelector("[data-action='continue-day']");
        this.refs.btnStartOver = c.querySelector("[data-action='start-over']");
    };

    SceneView.prototype.showScene = function(phase) {
        var self = this;
        var fill = this.refs.analyzerProgressFill;
        var parent = this.container && this.container.parentElement;
        if (fill && phase !== "analyzing") {
            fill.classList.remove("run");
            fill.style.width = "0%";
        }
        if (parent) {
            if (phase === "dayIntro" || phase === "ending") {
                parent.classList.add("story-phase");
            } else {
                parent.classList.remove("story-phase");
            }
        }
        PHASES.forEach(function(p) {
            var scene = self.scenes[p];
            if (scene) {
                if (p === phase) {
                    scene.classList.add("is-active");
                    scene.setAttribute("aria-hidden", "false");
                } else {
                    scene.classList.remove("is-active");
                    scene.setAttribute("aria-hidden", "true");
                }
            }
        });
        if (phase === "analyzing" && fill) {
            fill.style.width = "0%";
            fill.offsetHeight;
            fill.classList.add("run");
        }
        this._updateStepIndicator(phase);
        this._focusPhaseTarget(phase);
    };

    SceneView.prototype._updateStepIndicator = function(phase) {
        if (!this.stepIndicator) return;
        var steps = this.stepIndicator.querySelectorAll("[data-step]");
        var order = { record: 1, analyzing: 2, translate: 3, parrotTruth: 4, dayIntro: 0, ending: 0 };
        var n = order[phase];
        steps.forEach(function(step, i) {
            var stepNum = i + 1;
            if (stepNum <= n) {
                step.classList.add("is-active");
            } else {
                step.classList.remove("is-active");
            }
        });
    };

    SceneView.prototype._focusPhaseTarget = function(phase) {
        var target = null;
        if (phase === "intro" && this.refs.btnStart) target = this.refs.btnStart;
        if (phase === "record" && this.refs.parrotZone) target = this.refs.parrotZone;
        if (phase === "translate" && this.refs.btnSeeTruth) target = this.refs.btnSeeTruth;
        if (phase === "parrotTruth" && this.refs.btnNextRound) target = this.refs.btnNextRound;
        if (phase === "dayIntro" && this.refs.btnContinueDay) target = this.refs.btnContinueDay;
        if (phase === "ending" && this.refs.btnStartOver) target = this.refs.btnStartOver;
        if (target && typeof target.focus === "function") {
            window.setTimeout(function() {
                target.focus();
            }, 100);
        }
    };

    SceneView.prototype.getButton = function(phase, name) {
        if (name === "start") return this.refs.btnStart;
        if (name === "capture") return this.refs.btnCapture;
        if (name === "see-truth") return this.refs.btnSeeTruth;
        if (name === "next-round") return this.refs.btnNextRound;
        return null;
    };

    SceneView.prototype.getParrotContainer = function() {
        return this.refs.parrotContainer || null;
    };

    SceneView.prototype.setTranslationResult = function(obj, animated) {
        var self = this;
        if (!animated) {
            if (this.refs.translationText) this.refs.translationText.textContent = obj.sentence ? '"' + obj.sentence + '"' : "";
            if (this.refs.confidence) this.refs.confidence.textContent = obj.confidence != null ? obj.confidence + "% confidence" : "";
            if (this.refs.emotionValue) this.refs.emotionValue.textContent = obj.emotion || "";
            return;
        }
        var sentence = obj.sentence ? '"' + obj.sentence + '"' : "";
        var confidence = obj.confidence != null ? obj.confidence : 0;
        var emotion = obj.emotion || "";
        if (this.refs.translationText) this.refs.translationText.textContent = "";
        if (this.refs.confidence) this.refs.confidence.textContent = "0% confidence";
        if (this.refs.emotionValue) this.refs.emotionValue.textContent = "";
        var charIndex = 0;
        var confStart = 0;
        var confEnd = confidence;
        var typewriterInterval = 25;
        var countUpSteps = 20;
        var countUpStep = 0;

        function tick() {
            if (charIndex < sentence.length) {
                if (self.refs.translationText) self.refs.translationText.textContent = sentence.slice(0, charIndex + 1);
                charIndex++;
                window.setTimeout(tick, typewriterInterval);
                return;
            }
            if (countUpStep < countUpSteps) {
                countUpStep++;
                var c = Math.round(confStart + (confEnd - confStart) * countUpStep / countUpSteps);
                if (self.refs.confidence) self.refs.confidence.textContent = c + "% confidence";
                window.setTimeout(tick, 40);
                return;
            }
            if (self.refs.emotionValue) self.refs.emotionValue.textContent = emotion;
        }
        window.setTimeout(tick, 50);
    };

    SceneView.prototype.setParrotTruth = function(text) {
        if (this.refs.parrotTruthText) this.refs.parrotTruthText.textContent = text || "";
    };

    SceneView.prototype.setDayIntroText = function(dayIndex) {
        var intros = typeof window !== "undefined" && window.DAY_INTROS;
        var text = intros && intros[dayIndex] != null ? intros[dayIndex] : "";
        if (this.refs.dayIntroText) this.refs.dayIntroText.textContent = text;
    };

    SceneView.prototype.setEndingText = function() {
        var text = typeof window !== "undefined" && window.ENDING_TEXT ? window.ENDING_TEXT : "";
        if (this.refs.endingText) this.refs.endingText.textContent = text;
    };

    global.SceneView = SceneView;
})(typeof window !== "undefined" ? window : this);