/**
 * Story content for narrative arc: day intros and ending. No DOM.
 */
(function(global) {
    "use strict";

    var NUM_DAYS = 3;

    var DAY_INTROS = [
        "Day 1. Morning. The human picks up the phone.",
        "Day 2. Again. The human opens the app.",
        "Day 3. You have lost count."
    ];

    var ENDING_TEXT = "The human still has no idea. You're still just a parrot. The end.";

    global.NUM_DAYS = NUM_DAYS;
    global.DAY_INTROS = DAY_INTROS;
    global.ENDING_TEXT = ENDING_TEXT;
})(typeof window !== "undefined" ? window : this);