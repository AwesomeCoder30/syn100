/**
 * Particle field: Canvas renderer for 1,000 assumptions. Pan, zoom, hit-test, detail panel.
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
    var detailPlaceholder = document.getElementById("detailPlaceholder");
    var detailContent = document.getElementById("detailContent");
    var detailTitle = document.getElementById("detailTitle");
    var detailHuman = document.getElementById("detailHuman");
    var detailReality = document.getElementById("detailReality");

    if (!container || !window.ASSUMPTION_NODES || !window.SOUND_NODE) return;

    var nodes = window.ASSUMPTION_NODES;
    var soundNode = window.SOUND_NODE;
    var palette = window.CATEGORY_PALETTE || {};

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    container.appendChild(canvas);

    var width = 0;
    var height = 0;
    var scale = 360;
    var panX = 0;
    var panY = 0;
    var minScale = 60;
    var maxScale = 600;
    var hoveredNode = null;
    var selectedNode = null;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartPanX = 0;
    var dragStartPanY = 0;
    var hitThreshold = 0.06;
    var tooltipEl = null;

    function getCanvasRect() {
        var rect = canvas.getBoundingClientRect();
        return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }

    function screenToWorld(screenX, screenY) {
        var rect = getCanvasRect();
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var wx = (screenX - rect.left - cx - panX) / scale;
        var wy = (screenY - rect.top - cy - panY) / scale;
        return { x: wx, y: wy };
    }

    function findNodeAt(worldX, worldY) {
        var soundDist = Math.sqrt(worldX * worldX + worldY * worldY);
        if (soundDist < hitThreshold * 1.5) return soundNode;

        var nearest = null;
        var nearestDist = hitThreshold;
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var dx = worldX - n.x;
            var dy = worldY - n.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d < nearestDist) {
                nearestDist = d;
                nearest = n;
            }
        }
        return nearest;
    }

    function draw() {
        if (!width || !height) return;
        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2 + panX, height / 2 + panY);
        ctx.scale(scale, scale);

        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var isHover = n === hoveredNode;
            var isSelected = n === selectedNode;
            var color = palette[n.category] || "#8b8b7a";
            var r = (isHover || isSelected) ? 0.012 : 0.006;

            ctx.beginPath();
            ctx.arc(n.x, n.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            if (isHover || isSelected) {
                ctx.strokeStyle = "#1a1a1a";
                ctx.lineWidth = 0.002;
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(n.x, n.y, r + 0.004, 0, 2 * Math.PI);
                ctx.strokeStyle = "rgba(0,0,0,0.4)";
                ctx.stroke();
            }
        }

        var soundR = 0.015;
        var soundIsHover = soundNode === hoveredNode;
        var soundIsSelected = soundNode === selectedNode;
        ctx.beginPath();
        ctx.arc(soundNode.x, soundNode.y, soundR, 0, 2 * Math.PI);
        ctx.fillStyle = "#1a3a1a";
        ctx.fill();
        ctx.strokeStyle = "#0d1d0d";
        ctx.lineWidth = 0.002;
        ctx.stroke();
        if (soundIsHover || soundIsSelected) {
            ctx.beginPath();
            ctx.arc(soundNode.x, soundNode.y, soundR + 0.004, 0, 2 * Math.PI);
            ctx.strokeStyle = "#1a1a1a";
            ctx.lineWidth = 0.003;
            ctx.stroke();
        }

        ctx.restore();
    }

    function showNodeDetail(node) {
        detailPlaceholder.setAttribute("hidden", "hidden");
        detailContent.removeAttribute("hidden");
        detailTitle.textContent = node.id === "sound" ? "The vocalization" : "Translation";
        detailHuman.textContent = (node.humanLabel || "");
        detailHuman.classList.add("detail-label");
        detailReality.textContent = "Reality: " + (node.reality || "");
        detailReality.classList.add("detail-reality-text");
        if (window.AudioManager && node.id !== "sound") {
            try {
                var audio = new window.AudioManager();
                audio.playSquawk();
            } catch (e) {}
        }
    }

    function clearDetail() {
        detailContent.setAttribute("hidden", "hidden");
        detailPlaceholder.removeAttribute("hidden");
        selectedNode = null;
    }

    function updateTooltip(node, screenX, screenY) {
        if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.className = "particle-tooltip";
            tooltipEl.setAttribute("aria-hidden", "true");
            document.body.appendChild(tooltipEl);
        }
        if (!node) {
            tooltipEl.style.display = "none";
            return;
        }
        var text = (node.humanLabel || "").length > 50 ? (node.humanLabel || "").slice(0, 47) + "…" : (node.humanLabel || "");
        tooltipEl.textContent = text || (node.id === "sound" ? "The vocalization" : node.id);
        tooltipEl.style.display = "block";
        tooltipEl.style.left = (screenX + 12) + "px";
        tooltipEl.style.top = (screenY + 12) + "px";
    }

    function resize() {
        var rect = container.getBoundingClientRect();
        var w = rect.width;
        var h = Math.max(400, rect.height);
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = width = w;
            canvas.height = height = h;
            draw();
        }
    }

    function onMouseMove(e) {
        var rect = getCanvasRect();
        var world = screenToWorld(e.clientX, e.clientY);
        var node = findNodeAt(world.x, world.y);

        if (isDragging) {
            panX = dragStartPanX + (e.clientX - dragStartX);
            panY = dragStartPanY + (e.clientY - dragStartY);
            draw();
            return;
        }

        if (node !== hoveredNode) {
            hoveredNode = node;
            draw();
            updateTooltip(node, e.clientX, e.clientY);
            container.style.cursor = node ? "pointer" : "grab";
        }
    }

    function onMouseLeave() {
        if (isDragging) return;
        hoveredNode = null;
        draw();
        updateTooltip(null);
        container.style.cursor = "grab";
    }

    function onMouseDown(e) {
        if (e.button !== 0) return;
        var world = screenToWorld(e.clientX, e.clientY);
        var node = findNodeAt(world.x, world.y);
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartPanX = panX;
        dragStartPanY = panY;
    }

    function onMouseUp(e) {
        if (e.button !== 0) return;
        if (!isDragging) return;
        var moved = Math.abs(e.clientX - dragStartX) + Math.abs(e.clientY - dragStartY);
        isDragging = false;
        if (moved < 4) {
            var world = screenToWorld(e.clientX, e.clientY);
            var node = findNodeAt(world.x, world.y);
            if (node) {
                selectedNode = node;
                showNodeDetail(node);
            } else {
                clearDetail();
            }
            draw();
        }
    }

    function onWheel(e) {
        e.preventDefault();
        var worldBefore = screenToWorld(e.clientX, e.clientY);
        var factor = e.deltaY > 0 ? 0.9 : 1.1;
        var oldScale = scale;
        scale = Math.min(maxScale, Math.max(minScale, scale * factor));
        panX += worldBefore.x * (oldScale - scale);
        panY += worldBefore.y * (oldScale - scale);
        draw();
    }

    function onCanvasClick(e) {
        if (isDragging) return;
        var world = screenToWorld(e.clientX, e.clientY);
        var node = findNodeAt(world.x, world.y);
        if (!node) clearDetail();
        selectedNode = node || null;
        if (node) showNodeDetail(node);
        draw();
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseup", onMouseUp, true);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("click", function(e) {
        if (Math.abs(e.clientX - dragStartX) + Math.abs(e.clientY - dragStartY) < 4) {
            var world = screenToWorld(e.clientX, e.clientY);
            if (!findNodeAt(world.x, world.y)) clearDetail();
        }
    });

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(function() { resize(); });
})();