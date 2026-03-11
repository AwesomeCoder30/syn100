/**
 * Satirical "translation" data: 999 nodes = AI/human reductions of animal communication.
 * Each dot is one reductive label; center = the raw signal. For particle field.
 */
(function(global) {
    "use strict";

    var NUM_ASSUMPTIONS = 999;
    var CATEGORIES = [
        "emotion", "alarm", "social", "food", "territory", "mating",
        "request", "identity", "stress", "bonding", "confidence", "other"
    ];

    var SUBTYPES = {
        emotion: [
            "Translated as: happiness (87% confidence).",
            "Model output: sadness. Low energy vocalization.",
            "Classification: anxiety. Uncertainty detected.",
            "Interpreted as: curiosity. Exploratory call.",
            "Label: fear. Threat response.",
            "Single word: joy.",
            "Flattened to: contentment.",
            "Algorithm says: frustration. Repetition pattern.",
            "Human-readable: excitement.",
            "Reduced to: affection. Bonding indicator.",
            "Output: boredom. Low variation.",
            "One emotion: surprise.",
            "Category: irritation. Agitation score high.",
            "Translated to: wonder. Novel stimulus.",
            "Meaning: loneliness. Isolation call."
        ],
        alarm: [
            "Translated as: predator nearby.",
            "Model output: danger. Evacuate.",
            "Classification: warning. Conspecific alert.",
            "Interpreted as: threat level 3. Mobbing recommended.",
            "Label: alarm call. Flee response.",
            "Single word: danger.",
            "Flattened to: intruder detected.",
            "Algorithm says: risk. Vigilance increased.",
            "Human-readable: watch out.",
            "Reduced to: panic.",
            "Output: disturbance. Unfamiliar stimulus.",
            "One word: flee.",
            "Category: emergency. Urgency high.",
            "Translated to: alert. Group coordination.",
            "Meaning: uncertainty. Possible threat."
        ],
        social: [
            "Translated as: greeting. Contact re-established.",
            "Model output: submission. Lower status.",
            "Classification: dominance display. Hierarchy signal.",
            "Interpreted as: group cohesion. Flock together.",
            "Label: recognition. Individual identified.",
            "Single word: hello.",
            "Flattened to: follow me.",
            "Algorithm says: status signal. Rank asserted.",
            "Human-readable: I'm here.",
            "Reduced to: appeasement. Conflict avoidance.",
            "Output: coordination. Movement sync.",
            "One word: together.",
            "Category: affiliation. Social bond.",
            "Translated to: submission. Deference.",
            "Meaning: hierarchy. Pecking order."
        ],
        food: [
            "Translated as: hunger. Feeding request.",
            "Model output: food discovery. Location share.",
            "Classification: foraging signal. Group feed.",
            "Interpreted as: prey alert. Food available.",
            "Label: feeding call. Come eat.",
            "Single word: hungry.",
            "Flattened to: food excitement.",
            "Algorithm says: meal readiness. Offspring.",
            "Human-readable: feed me.",
            "Reduced to: seed preference. Diet type.",
            "Output: request. Parent to young.",
            "One word: food.",
            "Category: discovery. New resource.",
            "Translated to: sharing. Food offer.",
            "Meaning: satiation. Done eating."
        ],
        territory: [
            "Translated as: mine. Boundary asserted.",
            "Model output: leave. Intrusion response.",
            "Classification: territorial warning. Space claim.",
            "Interpreted as: nest defense. Offspring present.",
            "Label: dominance. Perch claimed.",
            "Single word: away.",
            "Flattened to: boundary marking.",
            "Algorithm says: intrusion. Unwanted presence.",
            "Human-readable: this is my spot.",
            "Reduced to: range declaration.",
            "Output: defense. Resource guard.",
            "One word: territory.",
            "Category: roost claim. Sleeping site.",
            "Translated to: back off. Aggression low.",
            "Meaning: space. Personal bubble."
        ],
        mating: [
            "Translated as: courtship. Mate attraction.",
            "Model output: reproductive intent. Breeding.",
            "Classification: pair formation. Bond offer.",
            "Interpreted as: mate call. Receptivity.",
            "Label: sexual display. Fitness signal.",
            "Single word: love.",
            "Flattened to: nest invitation.",
            "Algorithm says: rival exclusion. Competitor.",
            "Human-readable: choose me.",
            "Reduced to: breeding signal.",
            "Output: receptivity. Female ready.",
            "One word: mate.",
            "Category: courtship. Display behavior.",
            "Translated to: attraction. Pair bond.",
            "Meaning: reproductive. Seasonal."
        ],
        request: [
            "Translated as: attention wanted.",
            "Model output: object request. Give X.",
            "Model output: action request. Do Y.",
            "Classification: demand. Insistent.",
            "Interpreted as: preference. Choice signal.",
            "Label: want. Desire expressed.",
            "Single word: please.",
            "Flattened to: outcome preference.",
            "Algorithm says: goal expression. Intent.",
            "Human-readable: I want.",
            "Reduced to: choice. Option A not B.",
            "Output: need. Urgency medium.",
            "One word: request.",
            "Category: demand. High insistence.",
            "Translated to: ask. Polite.",
            "Meaning: unspecified want."
        ],
        identity: [
            "Translated as: signature call. Individual A.",
            "Model output: vocal fingerprint. Identity.",
            "Classification: self-expression. Personality.",
            "Interpreted as: mood state. Current disposition.",
            "Label: character signal. Trait.",
            "Single word: me.",
            "Flattened to: identity broadcast.",
            "Algorithm says: temperament. Stable trait.",
            "Human-readable: this is who I am.",
            "Reduced to: disposition. Today's mood.",
            "Output: recognition. Who's calling.",
            "One word: identity.",
            "Category: individual. Unique.",
            "Translated to: personality. Consistent.",
            "Meaning: unclassified individual."
        ],
        stress: [
            "Translated as: distress. Help needed.",
            "Model output: isolation call. Alone.",
            "Classification: confinement stress. Captivity.",
            "Interpreted as: handling stress. Human contact.",
            "Label: environmental stress. Habitat.",
            "Single word: pain.",
            "Flattened to: overstimulation.",
            "Algorithm says: understimulation. Bored.",
            "Human-readable: something's wrong.",
            "Reduced to: social stress. Group conflict.",
            "Output: physical discomfort. Injury?",
            "One word: stress.",
            "Category: anxiety. Chronic.",
            "Translated to: discomfort. Mild.",
            "Meaning: unknown negative state."
        ],
        bonding: [
            "Translated as: affection. Pair bond.",
            "Model output: attachment. Strong tie.",
            "Classification: companionship. Together.",
            "Interpreted as: trust signal. Safe.",
            "Label: social bond. Group identity.",
            "Single word: love.",
            "Flattened to: belonging.",
            "Algorithm says: connection. Relationship.",
            "Human-readable: we're together.",
            "Reduced to: loyalty. Pack member.",
            "Output: pair maintenance. Stay close.",
            "One word: bond.",
            "Category: affiliation. Friend.",
            "Translated to: loyalty signal. In-group.",
            "Meaning: positive social. Unspecified."
        ],
        confidence: [
            "94% confidence: emotion positive.",
            "Model certainty: 0.87. Greeting.",
            "Low confidence. Reclassifying.",
            "Uncertainty high. Best guess: alarm.",
            "Confidence score: 62%. Meaning: unknown.",
            "The algorithm is 91% sure: food.",
            "We rounded to one word. Confidence: 78%.",
            "Human interpretable. Accuracy: not validated.",
            "Single label. 10 dimensions discarded.",
            "Reduced to one category. Information: lost.",
            "Output: contentment. We're 73% sure.",
            "One word. 100% reductive.",
            "Category assigned. Animal did not confirm.",
            "Translated for convenience. Not for truth.",
            "Meaning: our guess. Their signal: unchanged."
        ],
        other: [
            "Unclassified. Residual category.",
            "Model output: noise. Ignore.",
            "Classification: artifact. Not vocalization.",
            "Interpreted as: ambiguous. Low confidence.",
            "Label: unknown intent.",
            "Single word: ???",
            "Flattened to: miscellaneous.",
            "Algorithm says: uninterpretable.",
            "Human-readable: we don't know.",
            "Reduced to: other. Catch-all.",
            "Output: error. Retry.",
            "One word: unclear.",
            "Category: unspecified. No fit.",
            "Translated to: nothing. Skip.",
            "Meaning: we gave up. Signal continues."
        ]
    };

    var REALITY_PHRASES = [
        "The animal didn't confirm.",
        "We reduced 10 dimensions to one word.",
        "Lost in translation.",
        "No non-human validation.",
        "We made it human-readable. We made it wrong.",
        "Complexity flattened to a label.",
        "The model said so. The animal didn't.",
        "One sound. One word. Wrong.",
        "We don't speak their language.",
        "Interpretation is not translation.",
        "We guessed.",
        "Unknown. Unverified.",
        "They didn't say that.",
        "We projected. They didn't consent.",
        "Simplified past recognition.",
        "Human categories. Non-human experience.",
        "The signal was richer. We threw most of it away.",
        "No.",
        "???",
        "We asserted. They didn't confirm."
    ];

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateNodes() {
        var nodes = [];
        var nodeIndex = 0;
        for (var c = 0; c < NUM_ASSUMPTIONS; c++) {
            var cat = CATEGORIES[c % CATEGORIES.length];
            var subtypes = SUBTYPES[cat];
            var humanLabel = subtypes[c % subtypes.length];
            var reality = pick(REALITY_PHRASES);
            nodes.push({
                id: "a" + nodeIndex,
                category: cat,
                humanLabel: humanLabel,
                reality: reality
            });
            nodeIndex += 1;
        }
        return nodes;
    }

    /**
     * Layout: radial by category. Normalized space [-1, 1] for x,y; center at (0,0).
     */
    function layoutNodes(nodes) {
        var numCategories = CATEGORIES.length;
        var angleSpan = (2 * Math.PI) / numCategories;
        var baseRadius = 0.08;
        var maxRadius = 0.98;
        var categoryCounts = {};
        var categoryIndices = {};
        CATEGORIES.forEach(function(c) {
            categoryCounts[c] = 0;
            categoryIndices[c] = 0;
        });
        nodes.forEach(function(n) {
            categoryCounts[n.category] = (categoryCounts[n.category] || 0) + 1;
        });

        nodes.forEach(function(n) {
            var cat = n.category;
            var idx = categoryIndices[cat];
            categoryIndices[cat] = idx + 1;
            var totalInCat = categoryCounts[cat];
            var catIndex = CATEGORIES.indexOf(cat);
            var baseAngle = catIndex * angleSpan;
            var angleJitter = (Math.random() - 0.5) * angleSpan * 0.6;
            var t = totalInCat > 1 ? idx / (totalInCat - 1) : 0;
            var r = baseRadius + t * (maxRadius - baseRadius) + (Math.random() - 0.5) * 0.04;
            var angle = baseAngle + angleJitter + (Math.random() - 0.5) * 0.2;
            n.x = r * Math.cos(angle);
            n.y = r * Math.sin(angle);
        });

        return nodes;
    }

    var assumptionNodes = layoutNodes(generateNodes());

    var SOUND_NODE = {
        id: "sound",
        x: 0,
        y: 0,
        humanLabel: "The vocalization",
        reality: "One signal. We gave it 1,000 human meanings. It had none of our words."
    };

    var CATEGORY_PALETTE = {
        emotion: "#c45c3e",
        alarm: "#8b3a3a",
        social: "#5a7fa8",
        food: "#b8860b",
        territory: "#6b8e6b",
        mating: "#9c5c8a",
        request: "#c9a227",
        identity: "#4a7c59",
        stress: "#6b5b7a",
        bonding: "#7b9eb5",
        confidence: "#8b7355",
        other: "#8b8b7a"
    };

    global.SOUND_NODE = SOUND_NODE;
    global.ASSUMPTION_NODES = assumptionNodes;
    global.CATEGORY_PALETTE = CATEGORY_PALETTE;
    global.ASSUMPTION_CATEGORIES = CATEGORIES;
})(typeof window !== "undefined" ? window : this);