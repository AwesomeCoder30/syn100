/**
 * Graph data: one central node (the parrot sound), interpretation nodes (human labels), edges from center to each.
 * humanLabel / reality for detail panel; displayLabel for visible node text.
 */
(function(global) {
    "use strict";

    var nodes = [
        { id: "sound", displayLabel: "The sound", humanLabel: "Vocalization (classified)", reality: "One sound. We don't know what it meant." },
        { id: "anxiety", displayLabel: "Anxiety?", humanLabel: "Anxiety call (94% confidence)", reality: "Noise." },
        { id: "mating", displayLabel: "Mating?", humanLabel: "Mating signal / reproductive intent", reality: "Unknown." },
        { id: "territory", displayLabel: "Territory?", humanLabel: "Territorial warning / boundary assertion", reality: "seed?" },
        { id: "flock", displayLabel: "Flock bonding?", humanLabel: "Flock cohesion vocalization", reality: "We made this up." },
        { id: "food", displayLabel: "Food?", humanLabel: "Food-related excitement signal", reality: "Maybe." },
        { id: "predator", displayLabel: "Predator?", humanLabel: "Predator alert (high certainty)", reality: "No." },
        { id: "other", displayLabel: "Other?", humanLabel: "Unspecified affective state", reality: "???" },
        { id: "stress", displayLabel: "Stress?", humanLabel: "Stress vocalization (91% confidence)", reality: "Nope." },
        { id: "joy", displayLabel: "Joy?", humanLabel: "Positive affect indicator", reality: "We guessed." },
        { id: "dominance", displayLabel: "Dominance?", humanLabel: "Dominance display / hierarchy signal", reality: "Unknown." },
        { id: "submission", displayLabel: "Submission?", humanLabel: "Submissive or appeasement call", reality: "No data." },
        { id: "curiosity", displayLabel: "Curiosity?", humanLabel: "Exploratory / inquisitive vocalization", reality: "???" },
        { id: "alarm", displayLabel: "Alarm?", humanLabel: "Alarm call (high certainty)", reality: "Maybe a yawn." },
        { id: "greeting", displayLabel: "Greeting?", humanLabel: "Greeting or contact call", reality: "Could be anything." },
        { id: "boredom", displayLabel: "Boredom?", humanLabel: "Boredom or understimulation signal", reality: "Bored." },
        { id: "confusion", displayLabel: "Confusion?", humanLabel: "Confusion or uncertainty indicator", reality: "We're the confused ones." },
        { id: "desire", displayLabel: "Desire?", humanLabel: "Desire or request vocalization", reality: "seed?" },
    ];

    var edges = [
        { source: "sound", target: "anxiety", humanLabel: "We interpreted it as this. 94% confidence. Parrots did not confirm." },
        { source: "sound", target: "mating", humanLabel: "We said it meant mating intent. 91% confidence. No validation." },
        { source: "sound", target: "territory", humanLabel: "We labeled it territorial. 88% confidence. Not verified." },
        { source: "sound", target: "flock", humanLabel: "We called it flock cohesion. Model fit 89%. We made it up." },
        { source: "sound", target: "food", humanLabel: "We inferred food excitement. High confidence. No ground truth." },
        { source: "sound", target: "predator", humanLabel: "We decided it was a predator alert. 97% confidence. The parrots: no comment." },
        { source: "sound", target: "other", humanLabel: "We put it in 'other'. Even we weren't sure. 62% confidence." },
        { source: "sound", target: "stress", humanLabel: "We classified it as stress. 91% confidence. Not verified." },
        { source: "sound", target: "joy", humanLabel: "We labeled it positive affect. 85% confidence. We guessed." },
        { source: "sound", target: "dominance", humanLabel: "We said dominance display. 87% confidence. Parrots did not confirm." },
        { source: "sound", target: "submission", humanLabel: "We called it submission. 79% confidence. No data." },
        { source: "sound", target: "curiosity", humanLabel: "We inferred curiosity. 82% confidence. Unverified." },
        { source: "sound", target: "alarm", humanLabel: "We decided alarm. 93% confidence. Maybe a yawn." },
        { source: "sound", target: "greeting", humanLabel: "We labeled it greeting. 86% confidence. Could be anything." },
        { source: "sound", target: "boredom", humanLabel: "We said boredom. 84% confidence. We're projecting." },
        { source: "sound", target: "confusion", humanLabel: "We called it confusion. 71% confidence. We're the confused ones." },
        { source: "sound", target: "desire", humanLabel: "We inferred desire. 90% confidence. seed?" },
        { source: "anxiety", target: "stress", humanLabel: "Correlated in our model. 87% confidence. Parrots did not confirm." },
        { source: "mating", target: "flock", humanLabel: "Linked in our taxonomy. 83% confidence. No validation." },
        { source: "territory", target: "predator", humanLabel: "Territory–predator axis. 88% confidence. We invented this link." },
        { source: "food", target: "desire", humanLabel: "Desire–food correlation. 85% confidence. Not verified." },
        { source: "dominance", target: "submission", humanLabel: "Hierarchy pair in our model. 81% confidence. Parrots: no comment." },
        { source: "alarm", target: "predator", humanLabel: "Alarm–predator link. 89% confidence. We asserted it." },
    ];

    global.GRAPH_NODES = nodes;
    global.GRAPH_EDGES = edges;
})(typeof window !== "undefined" ? window : this);