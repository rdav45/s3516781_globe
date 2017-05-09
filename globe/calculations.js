window.onload = initCalculations;

function initCalculations() {
    var pointsOrig = [new LatLon(89.9, 0), new LatLon(-20, 0), new LatLon(20, -40), new LatLon(-90, 40)];
    var points = [new LatLon(89.9, 0), new LatLon(40, 0), new LatLon(-20, 0), new LatLon(89, 0)];//[];

    var pointsA = [];
    var pointsB = [];
    var width = 10;
    //startPoint
    var brng = points[0].bearingTo(points[1]);
    pointsA.push(points[0].destinationPoint(brng + 90, width));
    pointsB.push(points[0].destinationPoint(brng - 90, width));

    //betweenPoints
    for (var i = 1; i < points.length - 1; i++) {
        var brng1 = points[i].bearingTo(points[i + 1]);
        var brng2 = points[i - 1].bearingTo(points[i]);
        var brng = (brng1 + brng2) / 2;
        pointsA.push(points[i].destinationPoint(brng + 90, width));
        pointsB.push(points[i].destinationPoint(brng - 90, width));
    }

    //endPoint
    var brng = points[points.length - 2].finalBearingTo(points[points.length - 1]);
    pointsA.push(points[points.length - 1].destinationPoint(brng + 90, width));
    pointsB.push(points[points.length - 1].destinationPoint(brng - 90, width));

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    
	var phinew = ((pointsA[0].lat() * 180 / Math.PI) / 2) + (Math.PI / 4);
    ctx.moveTo(lonToCanvas(pointsA[0].lon(), phinew), latToCanvas(pointsA[0].lon(), phinew));
    for (var i = 1; i < pointsA.length; i++) {
        var phinew = ((pointsA[i].lat() * 180 / Math.PI) / 2) + (Math.PI / 4);
        ctx.lineTo(lonToCanvas(pointsA[i].lon(), phinew), latToCanvas(pointsA[i].lon(), phinew));
    }
    var phinew = ((pointsB[pointsB.length - 1].lat() * 180 / Math.PI) / 2) + (Math.PI / 4);
    ctx.lineTo(lonToCanvas(pointsB[pointsB.length - 1].lon(), phinew), latToCanvas(pointsB[pointsB.length - 1].lon(), phinew));
    for (var i = pointsB.length - 2; i >= 0; i--) {
        var phinew = ((pointsB[i].lat() * 180 / Math.PI) / 2) + (Math.PI / 4);
        ctx.lineTo(lonToCanvas(pointsB[i].lon(), phinew), latToCanvas(pointsB[i].lon(), phinew));
    }

    ctx.fillStyle = '#f00';

    ctx.closePath();
    ctx.fill();

}

//x
function lonToCanvas(lon, phinew) {
    var x = 2 * Math.sin(phinew) * Math.sin(lon);
}

//y
function latToCanvas(lon, phinew) {
    var y = 2 * Math.sin(phinew) * Math.cos(lon);
}





