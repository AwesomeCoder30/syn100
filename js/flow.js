/**
 * GameFlow — phase state machine, round index, coordinates SceneView, TranslationEngine, AudioManager, ParrotView.
 */
(function(global) {
    "use strict";

    var PHASE_INTRO = "intro";
    var PHASE_RECORD = "record";
    var PHASE_ANALYZING = "analyzing";
    var PHASE_TRANSLATE = "translate";
    var PHASE_PARROT_TRUTH = "parrotTruth";
    var PHASE_DAY_INTRO = "dayIntro";
    var PHASE_ENDING = "ending";

    var ANALYZE_DURATION_MS = 1800;

    function GameFlow(sceneView, translationEngine, audioManager, parrotView) {
        this.sceneView = sceneView;
        this.translationEngine = translationEngine;
        this.audioManager = audioManager;
        this.parrotView = parrotView;
        this.currentPhase = null;
        this.roundIndex = 0;
        this.currentHumanTranslation = null;
        this.currentParrotTruth = null;
        this.analyzeTimeoutId = null;
    }

    GameFlow.prototype.start = function() {
        this.roundIndex = 0;
        this.goToPhase(PHASE_INTRO);
    };

    GameFlow.prototype.goToPhase = function(phase) {
        if (this.analyzeTimeoutId) {
            window.clearTimeout(this.analyzeTimeoutId);
            this.analyzeTimeoutId = null;
        }
        this.currentPhase = phase;
        this.sceneView.showScene(phase);
        if (this.parrotView) {
            if (phase === PHASE_RECORD || phase === PHASE_INTRO || phase === PHASE_DAY_INTRO) this.parrotView.setState("idle");
            if (phase === PHASE_PARROT_TRUTH) this.parrotView.setState("react");
        }
    };

    GameFlow.prototype.onStartClick = function() {
        this.goToPhase(PHASE_RECORD);
    };

    GameFlow.prototype.onParrotZoneClick = function() {
        if (this.currentPhase !== PHASE_RECORD) return;
        this.audioManager.playSquawk();
        if (this.parrotView) this.parrotView.setState("speaking");
        var self = this;
        window.setTimeout(function() {
            if (self.parrotView) self.parrotView.setState("idle");
        }, 200);
    };

    GameFlow.prototype.onCaptureClick = function() {
        if (this.currentPhase !== PHASE_RECORD) return;
        this.goToPhase(PHASE_ANALYZING);
        var self = this;
        this.analyzeTimeoutId = window.setTimeout(function() {
            self.analyzeTimeoutId = null;
            self.onAnalyzeComplete();
        }, ANALYZE_DURATION_MS);
    };

    GameFlow.prototype.onAnalyzeComplete = function() {
        this.currentHumanTranslation = this.translationEngine.getHumanTranslation();
        this.currentParrotTruth = this.translationEngine.getParrotTruth(this.roundIndex);
        this.sceneView.setTranslationResult(this.currentHumanTranslation, true);
        this.goToPhase(PHASE_TRANSLATE);
    };

    GameFlow.prototype.onTranslateShow = function() {
        // Already set in onAnalyzeComplete; translate scene is just shown.
    };

    GameFlow.prototype.onSeeTruthClick = function() {
        this.sceneView.setParrotTruth(this.currentParrotTruth);
        this.goToPhase(PHASE_PARROT_TRUTH);
    };

    GameFlow.prototype.onParrotTruthShow = function() {
        // Truth already set when we navigated.
    }

    GameFlow.prototype.onNextRoundClick = function() {
        this.roundIndex += 1;
        var numDays = typeof window !== "undefined" && window.NUM_DAYS != null ? window.NUM_DAYS : 3;
        if (this.roundIndex >= numDays) {
            this.sceneView.setEndingText();
            this.goToPhase(PHASE_ENDING);
        } else {
            this.sceneView.setDayIntroText(this.roundIndex);
            this.goToPhase(PHASE_DAY_INTRO);
        }
    };

    GameFlow.prototype.onContinueDayClick = function() {
        this.goToPhase(PHASE_RECORD);
    };

    GameFlow.prototype.onStartOverClick = function() {
        this.roundIndex = 0;
        this.goToPhase(PHASE_INTRO);
    };

    global.GameFlow = GameFlow;
})(typeof window !== "undefined" ? window : this);