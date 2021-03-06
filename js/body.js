function Body(mass, x, y) {
    var body = {
        x: x,
        y: y,
        radius: mass,
        mass: mass,
        valx: 0,
        vely: 0,
        forces: [],
        netForce: null,
        color: "white",

        draw: function(ctx, addx, addy) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x + addx, addy - this.y,
            //ctx.arc(this.x, this.y,
                this.radius,
                0, Math.PI * 2,
                false
            );
     
            ctx.fill();
            ctx.closePath();
        },

        calculateForce: function(body) {
            // Newton gravity force
            var p1 = this.getCoords();
            var p2 = body.getCoords();
            var dir = LineFrom2Points(p1, p2);

            var G = 100;  // Real value: 6.667e-11 Nm**2/kg**2
            var r = Math.pow(Utils.distance(p1, p2), 2);
            var f = (G * this.mass * body.mass) / r;

            var s = getSense(dir, p1, p2);
            //console.log(f, dir.m, p1);

            var v = Vector(f, dir.m, s, p1);
            //console.log(v);
            //console.log(v.lastPoint);
            return v;
        },

        getCoords: function() {
            return {
                x: this.x,
                y: this.y,
            }
        },

        addForce: function(vector) {
            this.forces.push(vector);
        },

        updateNetForce: function() {
            if (this.forces.length === 0) {
                return;
            }

            var netForce = this.forces[0];
            var add = false;
            this.forces.forEach(function(vector) {
                if (add && vector !== undefined) {
                    netForce = netForce.add(vector);
                    //console.log(netForce);
                }
                add = true;
            });

            this.netForce = netForce;
            this.netForce.point = {x: this.x, y: this.y};
        },
    };

    return body;
}
