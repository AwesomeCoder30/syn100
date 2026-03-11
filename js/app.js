/**
 * Parrot-to-Human™ — Entry point: init, wire dependencies, attach event listeners.
 * No game or UI logic; delegates to GameFlow.
 */
(function() {
    "use strict";

    var sceneContainerSelector = "#sceneContainer";
    var flow = null;

    function init() {
        var sceneView = new window.SceneView(sceneContainerSelector);
        var translationEngine = new window.TranslationEngine();
        var audioManager = new window.AudioManager();
        var parrotContainer = sceneView.getParrotContainer();
        var parrotView = parrotContainer ? new window.ParrotView("[data-parrot-container]") : null;

        flow = new window.GameFlow(sceneView, translationEngine, audioManager, parrotView);
        flow.start();

        bindEvents(sceneContainerSelector, flow);
        bindAboutLink();
    }

    function bindEvents(containerSelector, gameFlow) {
        var container = document.querySelector(containerSelector);
        if (!container) return;

        container.addEventListener("click", function(e) {
            var action = e.target.getAttribute("data-action");
            if (action === "start") {
                e.preventDefault();
                gameFlow.onStartClick();
            }
            if (action === "capture") {
                e.preventDefault();
                gameFlow.onCaptureClick();
            }
            if (action === "see-truth") {
                e.preventDefault();
                gameFlow.onSeeTruthClick();
            }
            if (action === "next-round") {
                e.preventDefault();
                gameFlow.onNextRoundClick();
            }
            if (action === "parrot-zone") {
                e.preventDefault();
                gameFlow.onParrotZoneClick();
            }
            if (action === "continue-day") {
                e.preventDefault();
                gameFlow.onContinueDayClick();
            }
            if (action === "start-over") {
                e.preventDefault();
                gameFlow.onStartOverClick();
            }
        });

        container.addEventListener("keydown", function(e) {
            if (e.target.getAttribute("data-action") !== "parrot-zone") return;
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                gameFlow.onParrotZoneClick();
            }
        });
    }

    function bindAboutLink() {
        var aboutLink = document.getElementById("aboutLink");
        var reveal = document.getElementById("reveal");
        if (aboutLink && reveal) {
            aboutLink.addEventListener("click", function(e) {
                e.preventDefault();
                reveal.classList.toggle("is-visible");
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();