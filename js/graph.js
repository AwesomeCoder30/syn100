/**
 * Interactive network: D3 force-directed graph, zoom, drag, detail panel on click.
 */
(function() {
    "use strict";

    var aboutLink = document.getElementById("aboutLink");
    var reveal = document.getElementById("reveal");
    if (aboutLink && reveal) {
        aboutLink.addEventListener("click", function(e) {
            e.preventDefault();
            reveal.classList.toggle("is-visible");
            if (reveal.classList.contains("is-visible")) {
                reveal.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        });
    }

    var container = document.getElementById("graph-container");
    var detailPanel = document.getElementById("detail-panel");
    var detailPlaceholder = document.getElementById("detailPlaceholder");
    var detailContent = document.getElementById("detailContent");
    var detailTitle = document.getElementById("detailTitle");
    var detailHuman = document.getElementById("detailHuman");
    var detailReality = document.getElementById("detailReality");

    if (!container || !window.GRAPH_NODES || !window.GRAPH_EDGES) return;

    var nodes = window.GRAPH_NODES.map(function(d) { return Object.assign({}, d); });
    var links = window.GRAPH_EDGES.map(function(d) {
        return { source: d.source, target: d.target, humanLabel: d.humanLabel };
    });

    var width = container.clientWidth || 800;
    var height = Math.max(400, (container.clientHeight || 500));
    var centerX = width / 2;
    var centerY = height / 2;
    var ringRadius = Math.min(width, height) * 0.38;

    var centerNode = nodes.filter(function(d) { return d.id === "sound"; })[0];
    var interpretationNodes = nodes.filter(function(d) { return d.id !== "sound"; });
    if (centerNode) {
        centerNode.fx = centerX;
        centerNode.fy = centerY;
        centerNode.x = centerX;
        centerNode.y = centerY;
    }
    interpretationNodes.forEach(function(d, i) {
        var angle = (i / interpretationNodes.length) * 2 * Math.PI - Math.PI / 2;
        d.x = centerX + ringRadius * Math.cos(angle);
        d.y = centerY + ringRadius * Math.sin(angle);
    });

    var svg = d3.select(container)
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

    var g = svg.append("g");

    var zoom = d3.zoom()
        .scaleExtent([0.3, 3])
        .on("zoom", function(event) { g.attr("transform", event.transform); });

    svg.call(zoom);

    var linkGroup = g.append("g")
        .attr("class", "links")
        .selectAll("g")
        .data(links)
        .join("g")
        .attr("class", "link-group");

    linkGroup.append("line")
        .attr("class", "link link-hit")
        .attr("stroke", "transparent")
        .attr("stroke-width", 20);
    linkGroup.append("line")
        .attr("class", "link link-visible")
        .attr("stroke", "#a8b5a8")
        .attr("stroke-opacity", 0.45)
        .attr("stroke-width", 1.2);

    linkGroup.append("title").text(function(d) { return d.humanLabel || "Link"; });

    var nodeGroup = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .attr("class", "node-group");

    nodeGroup.append("circle")
        .attr("class", "node")
        .attr("r", function(d) { return d.id === "sound" ? 14 : 10; })
        .attr("fill", "#2d5a27")
        .attr("stroke", "#1a3a1a")
        .attr("stroke-width", 1.5);

    var labelOffset = 26;

    nodeGroup.append("text")
        .attr("class", "node-label")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("fill", "#2a2a2a")
        .style("font-weight", "500")
        .text(function(d) { return d.displayLabel || d.id; });

    nodeGroup
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("click", nodeClicked)
        .on("mouseover", nodeOver)
        .on("mouseout", nodeOut);

    var simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(function(d) { return d.id; }).distance(function(d) { return d.source.id === "sound" || d.target.id === "sound" ? ringRadius : 80; }))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("collision", d3.forceCollide().radius(function(d) { return d.id === "sound" ? 32 : 38; }))
        .force("radial", d3.forceRadial(function(d) { return d.id === "sound" ? 0 : ringRadius; }, centerX, centerY).strength(0.4))
        .force("center", d3.forceCenter(centerX, centerY))
        .on("tick", ticked);

    function ticked() {
        linkGroup.selectAll("line")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        nodeGroup.select("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        nodeGroup.select("text")
            .attr("x", function(d) {
                if (d.id === "sound") return d.x;
                var dx = d.x - centerX;
                var dy = d.y - centerY;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                return d.x + (dx / dist) * labelOffset;
            })
            .attr("y", function(d) {
                if (d.id === "sound") return d.y + 5;
                var dx = d.x - centerX;
                var dy = d.y - centerY;
                var dist = Math.sqrt(dx * dx + dy * dy) || 1;
                return d.y + (dy / dist) * labelOffset;
            });
    }

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        if (event.subject.id === "sound") {
            event.subject.fx = width / 2;
            event.subject.fy = height / 2;
        } else {
            event.subject.fx = null;
            event.subject.fy = null;
        }
    }

    function showNodeDetail(d) {
        detailPlaceholder.setAttribute("hidden", "hidden");
        detailContent.removeAttribute("hidden");
        detailTitle.textContent = "Node";
        detailHuman.textContent = "Human interpretation: " + (d.humanLabel || "");
        detailHuman.classList.add("detail-label");
        detailReality.textContent = "Reality: " + (d.reality || "");
        detailReality.classList.add("detail-reality-text");
        if (window.AudioManager) {
            try {
                var audio = new window.AudioManager();
                audio.playSquawk();
            } catch (e) {}
        }
    }

    function showLinkDetail(d) {
        detailPlaceholder.setAttribute("hidden", "hidden");
        detailContent.removeAttribute("hidden");
        detailTitle.textContent = "Link";
        detailHuman.textContent = d.humanLabel || "";
        detailHuman.classList.add("detail-label");
        detailReality.textContent = "This link was inferred with high confidence. The parrots did not confirm.";
        detailReality.classList.add("detail-reality-text");
    }

    function clearDetail() {
        detailContent.setAttribute("hidden", "hidden");
        detailPlaceholder.removeAttribute("hidden");
    }

    function nodeClicked(event, d) {
        event.stopPropagation();
        showNodeDetail(d);
        nodeGroup.classed("selected", function(n) { return n === d; });
        linkGroup.classed("highlight", false);
    }

    function nodeOver(event, d) {
        linkGroup.classed("highlight", function(l) {
            return l.source === d || l.target === d;
        });
        nodeGroup.classed("hover", function(n) { return n === d; });
    }

    function nodeOut() {
        linkGroup.classed("highlight", false);
        nodeGroup.classed("hover", false);
    }

    linkGroup.on("click", function(event, d) {
        event.stopPropagation();
        showLinkDetail(d);
        nodeGroup.classed("selected", false);
        linkGroup.classed("highlight", function(l) { return l === d; });
    });

    nodeGroup.append("title").text(function(d) { return d.humanLabel || d.id; });

    svg.on("click", function() {
        clearDetail();
        nodeGroup.classed("selected", false);
        linkGroup.classed("highlight", false);
    });

})();