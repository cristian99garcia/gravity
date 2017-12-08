var DrawArea = (function() {

    var canvas;
    var ctx;

    function init() {
        console.log("igri");
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        loadBodies();
        draw();
    }

    function draw() {
        drawBackground();
    }

    function drawBackground() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    return {
        init: init;
    }
})();
