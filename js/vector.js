function Line(m, n) {
    if (m === Infinity) {
        m = 0;
    }

    if (isNaN(n)) {
        n = 0;
    }

    return {
        m: m,
        n: n,
        repr: "y = " + m + "x + " + n,

        isVertical: function() {
            return (this.m === 0);
        },

        parallelThroughPoint: function(point) {
            // y = m*x + n
            // y' = m(x - x0) + y0
            // y' = m*x - m*x0 + y0  =>  n' = m*x0 + y0
            var n = point.y - this.m * point.x;
            //console.log(this.m, n);
            return Line(this.m, n);
        },

        perpendicularTrhoughPoint: function(point) {
            // y = m*x + n
            // m' = -1 / m
            // y' - y0 = m'(x' - x0)
            // y' = m'*x' - m'*x0 + y0

            var m = -1 / this.m;
            var n = point.y - m * point.x;
            return Line(m, n);
        },

        intersection: function(line) {
            if (this.m === line.m) {
                return { x: Infinity, y: Infinity };
            }

            // y = m*x + n
            // y = m'*x + n'
            // m*x + n = m'*x + n'
            // (m - m')x = n' - n
            // x = (n' - n) / (m - m')

            var x = (line.n - this.n) / (this.m - line.m);
            var y = this.m * x + this.n;

            return { x: x, y: y };
        }
    }
}


function LineFrom2Points(p1, p2) {
    var m = (p2.y - p1.y) / (p2.x - p1.x);
    var n = p1.y - p1.x * m

    return Line(m, n);
}


function PointSlope(m, p) {
    // y = mx + n
    // y - y0 = m(x - x0)
    // y = mx - m*x0 + y0

    n = p.y - m * p.x;
    return Line(m, n);
}


function getSense(line, p1, p2) {
    if (p1.x > p2.x) {
        return ">";
    } else {
        return "<";
    }
}


function calculateVectorLastPoint(vector) {
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

    if (vector.scale === undefined) {
        vector.scale = 10;
    }

    var p = vector.point;  // Center
    var m = vector.direction.m;
    var n = vector.direction.n;

    // x**2 + y**2 + ax + by + c = 0
    var a = -2 * p.x;
    var b = -2 * p.y;
    var r = vector.magnitude * vector.scale;
    var c = Math.pow(p.x, 2) + Math.pow(p.y, 2) - Math.pow(r, 2);

    // Ax**2 + Bx + C = 0
    var A = 1 + Math.pow(m, 2);
    var B = 2 * m * n + a + b * m;
    var C = Math.pow(n, 2) + b * n + c;
    var D = Math.sqrt(Math.pow(B, 2) - 4 * A * C);

    var x, y;
    if (vector.sense === ">") {
        x = (-B - D) / (2*A);
    } else {
        x = (-B + D) / (2*A);
    }

    var y = m*x + n;

    vector.lastPoint = { x: x, y: y };
}


function Vector(magnitude, slope, sense, pointOfApplication, scale) {
    //console.log(magnitude, slope, sense, pointOfApplication, scale);
    //console.log(magnitude);
    var V = {
        magnitude: magnitude,
        sense: sense,
        point: pointOfApplication,
        direction: PointSlope(slope, pointOfApplication),
        lastPoint: null,
        scale: scale,

        add: function(vector) {
            if (this.point.x !== vector.point.x || this.point.y !== vector.point.y) {
                return;  // TODO
            }

            if (this.direction.m == vector.direction.m && this.direction.n == vector.point.n) {
                if (this.sense == vector.sense) {
                    return Vector(
                        this.magnitude + vector.magnitude,
                        this.direction.m,
                        this.sense,
                        this.point,
                        this.scale,
                    );
                } else {
                    var magnitude = this.magnitude - vector.magnitude;
                    var sense = this.sense;
                    if (magnitude < 0) {
                        sense = vector.sense;
                        magnitude = Math.abs(magnitued);
                    }

                    return Vector(
                        magnitude,
                        this.direction.m,
                        sense,
                        this.point,
                        this.scale,
                    );
                }
            }

            var par1 = this.direction.parallelThroughPoint(vector.lastPoint);
            var par2 = vector.direction.parallelThroughPoint(this.lastPoint);

            var lp = par1.intersection(par2);
            var magn = Utils.distance(this.point, lp) / this.scale;
            var ln = LineFrom2Points(this.point, lp);
            var sense = ">";  // FIXME

            //console.log(par1, par2);
            var v = Vector(magn, ln.m, sense, this.point, this.scale);
            v.lastPoint = lp;

            return v;
        },
    }

    calculateVectorLastPoint(V);
    return V;
}
