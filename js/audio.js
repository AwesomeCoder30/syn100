/**
 * AudioManager — Web Audio squawk. Encapsulates all sound.
 */
(function(global) {
    "use strict";

    function AudioManager() {
        this.audioContext = null;
    }

    AudioManager.prototype.playSquawk = function() {
        if (!this.audioContext) {
            this.audioContext = new(window.AudioContext || window.webkitAudioContext)();
        }
        var ctx = this.audioContext;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        var t = ctx.currentTime;
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.08);
        osc.frequency.setValueAtTime(600, t + 0.1);
        osc.frequency.exponentialRampToValueAtTime(200, t + 0.2);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

        osc.start(t);
        osc.stop(t + 0.25);
    };

    global.AudioManager = AudioManager;
})(typeof window !== "undefined" ? window : this);