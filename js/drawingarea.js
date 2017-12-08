var DrawingArea = (function() {

    var canvas;
    var ctx;
    var update = true;
    var bodies;

    function init() {
        document.addEventListener("keydown", keydown);
        document.addEventListener("mousemove", mousemove);

        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        loadBodies();
    }

    function loadBodies() {
        bodies = [
            Body(30, 100, 0),
            Body(50, 0, 0),
            Body(75, 250, 200),
        ]

        updateForces();
    }

    function updateForces() {
        for (i=0; i<bodies.length; i++) {
            for (k=0; k<bodies.length; k++) {
                var b1 = bodies[i];
                var b2 = bodies[k];
                b1.forces[k] = b1.calculateForce(b2);
            }
        }
    }

    function draw() {
        drawBackground();
        drawBodies();
        drawVectors();
    }

    function drawBackground() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawBodies() {
        for (i=0; i<bodies.length; i++) {
            bodies[i].draw(ctx, canvas.width / 2, canvas.height / 2);
        }
    }

    function drawVectors() {
        var colors = ["blue", "green", "red"];

        if (bodies.length < 2) return;

        for (i=0; i<bodies.length; i++) {
            bodies[i].forces.forEach(function(vector) {
                vector.point = {x:bodies[i].x, y:bodies[i].y};
                drawVector(vector, colors[i], bodies[i]);
            });
        }
    }

    function drawVector(vector, c, b) {
        p1 = vector.point;
        p2 = vector.lastPoint;

        ctx.beginPath();
        ctx.strokeStyle = c;
        ctx.moveTo(p1.x + canvas.width / 2, -p1.y + canvas.height / 2);
        ctx.lineTo(p2.x + canvas.width / 2, -p2.y + canvas.height / 2);
        ctx.stroke();
    }

    function keydown(event) {
        if (event.code === "Space") {
            update = !update;
        }
    }

    function mousemove(event) {
        var b = bodies[0];
        b.x = event.x - canvas.width / 2 + 80;
        b.y = -event.y + canvas.height / 2 + 8;
        updateForces();
    }

    function _continue() {
        return update;
    }

    return {
        init: init,
        draw: draw,
        _continue: _continue,
    }
})();
