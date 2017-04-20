/*global enter_fullscreen */

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

function maximiseCanvasSize() {
    var canvasContainer = document.getElementById("canvasContainer"),
            canvas = document.getElementById("canvas"),
            d = Math.min(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
    canvas.width = d;
    canvas.height = d;
}

function registerEvents() {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    document.getElementById("canvas").onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    window.onresize = maximiseCanvasSize;
    
    document.addEventListener("fullscreenchange", enter_fullscreen);
}

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;
    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    pole += deltaY / 10;
    meridian += deltaX;
    //console.log(pole, meridian);
    lastMouseX = newX
    lastMouseY = newY;
}


var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;

    if (String.fromCharCode(event.keyCode) == "F") {
        filter += 1;
        if (filter == 3) {
            filter = 0;
        }
    }
}


function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys() {
    if (currentlyPressedKeys[49]) {
        // Page Up 33
        //z -= 0.05;

        radius -= 1;
        if (radius < 0)
            radius = 0;
    }
    if (currentlyPressedKeys[50]) {
        // Page Down 34
        //z += 0.05; 
        radius += 1;
        if (radius > screen.height / 2.0)
            radius = screen.height / 2.0;
    }
    if (currentlyPressedKeys[51]) {
        // Page Up 33
        z -= 0.001;
        if (z < -2.4)
            z = -2.4;
    }
    if (currentlyPressedKeys[52]) {
        // Page Down 34
        z += 0.001;
        if (z > -1)
            z = -1;
    }
    if (currentlyPressedKeys[37]) {
        // Left cursor key
        //ySpeed -= 1;
        meridian -= 2;
    }
    if (currentlyPressedKeys[39]) {
        // Right cursor key
        //ySpeed += 1;
        meridian += 2;
    }
    if (currentlyPressedKeys[38]) {
        // Up cursor key
        //xSpeed -= 1;
        pole -= 1;
    }
    if (currentlyPressedKeys[40]) {
        // Down cursor key
        //xSpeed += 1;
        pole += 1;
    }
    //if(currentlyPressedKeys[96] && currentlyPressedKeys[107]){
    if (currentlyPressedKeys[53]) {
        console.log(spline.getKnot(1));
        //Numpad 0 und plus
        //if(!(spline.getKnot(1) >= 80 || spline.getKnot(1) <= -80)){
        //{
        spline.setKnot(1, spline.getKnot(1) + 1);
        //}
        // console.log(spline.getKnot(1));
        splineVals = spline.getSplineCoefficients();
        console.log(splineVals);
    }
    //if(currentlyPressedKeys[96] && currentlyPressedKeys[109]){
    if (currentlyPressedKeys[54]) {
        console.log(spline.getKnot(1));
        //Numpad 0 und minus
        //if(!(spline.getKnot(1) >= 80 || spline.getKnot(1) <= -80)){
        //{
        spline.setKnot(1, spline.getKnot(1) - 1);
        //}
        //console.log(spline.getKnot(1));
        splineVals = spline.getSplineCoefficients();
        console.log(splineVals);

    }


}
