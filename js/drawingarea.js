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
            var b1 = bodies[i];
            b1.forces = [];

            for (k=0; k<bodies.length; k++) {
                var b2 = bodies[k];
                if (b1 !== b2) {
                    b1.forces[b1.forces.length] = b1.calculateForce(b2);
                }
            }

            b1.updateNetForce();
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
                drawVector(vector, colors[i]);
            });
        
            if (bodies[i].netForce !== null) {
                drawVector(bodies[i].netForce, "yellow", bodies[i]);
            }
        }
    }

    function drawVector(vector, c) {
        p1 = vector.point;
        p2 = vector.lastPoint;

        ctx.beginPath();
        ctx.strokeStyle = c;
        ctx.moveTo(p1.x + canvas.width / 2, -p1.y + canvas.height / 2);
        ctx.lineTo(p2.x + canvas.width / 2, -p2.y + canvas.height / 2);
        ctx.stroke();
    }

    function drawLine(line, c) {
        var x1 = -canvas.width / 2;
        var y1 = line.m * x1 + line.n;
        var x2 = canvas.width / 2;
        var y2 = line.m * x2 + line.n;

        ctx.beginPath();
        ctx.strokeStyle = c;
        ctx.moveTo(x1 + canvas.width / 2, -y1 + canvas.height / 2);
        ctx.lineTo(x2 + canvas.width / 2, -y2 + canvas.height / 2);
        ctx.stroke();
    }

    function keydown(event) {
        if (event.code === "Space") {
            update = !update;
        }
    }

    function mousemove(event) {
        var b = bodies[0];
        b.x = event.x - canvas.width / 2;
        b.y = -event.y + canvas.height / 2;
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
