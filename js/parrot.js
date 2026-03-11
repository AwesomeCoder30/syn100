/**
 * ParrotView — parrot display state (idle / speaking / react). No game logic.
 * Phase 1: SVG/emoji + CSS class toggles; Phase 2 can swap in p5.js.
 */
(function(global) {
    "use strict";

    var STATE_IDLE = "idle";
    var STATE_SPEAKING = "speaking";
    var STATE_REACT = "react";

    function ParrotView(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.currentState = STATE_IDLE;
        if (this.container) {
            this.container.setAttribute("data-parrot-state", this.currentState);
        }
    }

    ParrotView.prototype.setState = function(mode) {
        var state = mode === "speaking" ? STATE_SPEAKING : mode === "react" ? STATE_REACT : STATE_IDLE;
        this.currentState = state;
        if (this.container) {
            this.container.setAttribute("data-parrot-state", state);
        }
    };

    global.ParrotView = ParrotView;
})(typeof window !== "undefined" ? window : this);