function Line(m, n) {
    return {
        m: m,
        n: n,
        repr: "y = " + m + "x + " + n,
    }
}

function LineFrom2Points(p1, p2) {
    var m = (p2.y - p1.y) / (p2.x - p1.x);
    var n = p1.y - p1.x * m

    return Line(m, n);
}


function getSense(line, p1, p2) {
    if (p1.x > p2.x) {
        return ">";
    } else {
        return "<";
    }
}

function Vector(magnitude, direction, sense, pointOfApplication) {
    var V = {
        magnitude: magnitude,
        direction: direction,
        sense: sense,
        point: pointOfApplication,

        calculateLastPoint: function(scale) {
            // Line and Circumference intersection
            // Circumference of center (x0, y0) and radium r:
            // (x - x0)**2 + (y - y0)**2 = r**2
            // x**2 - 2*x0*x + x0**2 + y**2 - 2*y0*y + y0**2 - r**2 = 0
            // x**2 + y**2 - 2*x0*x - 2*y0*y + x0**2 + y0**2 + r**2 = 0
            // a = -2*x0
            // b = -2*y0
            // c = x0**2 + y0**2 - r**2
            // x**2 + y**2 + ax + by + c = 0
            //
            // Intersection:
            // y = mx + n
            // (1 + m**2)*x**2 + (2mn + a + bm)*x + n**2 + b*n + c = 0
            // A = 1 + m**2
            // B = 2mn + a + bm
            // C = n**2 + bn + c
            // A*x**2 + B*x + C = 0
            // This equation should have 2 solutions because the circumference
            // of center on a (x0, y0) belonging to line.
            //
            // D = sqrt(b**2 - 4*A*C)
            // x0 = (-b + D) / 2*a
            // y0 = m*x0 + n
            // x1 = (-b - D) / 2*a
            // y0 = m*x1 + n

            var p = this.point;  // Center
            var m = this.direction.m;
            var n = this.direction.n;

            // x**2 + y**2 + ax + by + c = 0
            var a = -2 * p.x;
            var b = -2 * p.y;
            var r = this.magnitude * scale;
            var c = Math.pow(p.x, 2) + Math.pow(p.y, 2) - Math.pow(r, 2);

            // Ax**2 + Bx + C = 0
            var A = 1 + Math.pow(m, 2);
            var B = 2 * m * n + a + b * m;
            var C = Math.pow(n, 2) + b * n + c;
            var D = Math.sqrt(Math.pow(B, 2) - 4 * A * C);

            var x, y;
            if (this.sense === ">") {
                x = (-B - D) / (2*A);
            } else {
                x = (-B + D) / (2*A);
            }

            var y = m*x + n;

            return { x: x, y: y };
        },

        lastPoint: {},
    }

    V.lastPoint = V.calculateLastPoint(10);
    return V;
}
