function Body(mass) {
    this.mass = mass;
    this.radius = 50;
    this.x = 100;
    this.y = 100;

    this.draw = fucntion(ctx) {
        ctx.fillStyle = "black";
        ctx.beginPath();
 
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2,
            false
        );
 
        ctx.closePath();
        ctx.fill();
    }
}

var body = Body(10);
