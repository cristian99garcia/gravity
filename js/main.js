var da = DrawingArea;
var fps = 60;

function setFPS(fps) {
    function update() {
        setTimeout(function () {
            if (da._continue()) { da.draw(); }
            update();
        }, 1000 / fps);
    }

    update();
}

function main() {
    da.init();
    setFPS(fps);
};

window.onload = main;