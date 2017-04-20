window.onload = initCalculations;

function initCalculations() {
    var pointsOrig = [new LatLon(89.9, 0), new LatLon(-20, 0), new LatLon(20, -40), new LatLon(-90, 40)];
    var points = [new LatLon(89.9, 0), new LatLon(40, 0), new LatLon(-20, 0), new LatLon(89, 0)];//[];
    //refinement
    /*for(var i = 0; i < pointsOrig.length-1; i++){
     points.push(pointsOrig[i]);
     var dist = pointsOrig[i].distanceTo(pointsOrig[i+1]);
     if(dist > 20){
     var eps = Math.floor(dist/10);
     console.log(eps);
     for(var j = 1; j < eps; j++){
     var brng = pointsOrig[i].bearingTo(pointsOrig[i+1]);
     points.push(pointsOrig[i].destinationPoint(brng, j*10));
     }
     }
     
     }*/
    //points.push(pointsOrig[pointsOrig.length-1]);

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
    /*
     ctx.moveTo(lonToCanvas(points[0].lon()), latToCanvas(points[0].lat()));
     for(var i = 1; i < points.length; i++){
     ctx.lineTo(lonToCanvas(points[i].lon()), latToCanvas(points[i].lat()));	
     }*/
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
    /*
     ctx.lineTo(lonToCanvas(pointsB[0].lon()), latToCanvas(pointsB[0].lat()));
     for(var i = 1; i < pointsB.length; i++){
     ctx.lineTo(lonToCanvas(pointsB[i].lon()), latToCanvas(pointsB[i].lat()));	
     }*/

    /*
     ctx.moveTo(lonToCanvas(p1.lon()), latToCanvas(p1.lat()));
     ctx.lineTo(lonToCanvas(p2.lon()), latToCanvas(p2.lat()));
     
     ctx.moveTo(lonToCanvas(p1.lon()), latToCanvas(p1.lat()));
     ctx.lineTo(lonToCanvas(p1A.lon()), latToCanvas(p1A.lat()));
     ctx.moveTo(lonToCanvas(p1.lon()), latToCanvas(p1.lat()));
     ctx.lineTo(lonToCanvas(p1B.lon()), latToCanvas(p1B.lat()));
     
     ctx.moveTo(lonToCanvas(p2.lon()), latToCanvas(p2.lat()));
     ctx.lineTo(lonToCanvas(p2A.lon()), latToCanvas(p2A.lat()));
     ctx.moveTo(lonToCanvas(p2.lon()), latToCanvas(p2.lat()));
     ctx.lineTo(lonToCanvas(p2B.lon()), latToCanvas(p2B.lat()));*/


    ctx.fillStyle = '#f00';

    ctx.closePath();
    ctx.fill();


    //ctx.stroke();


}
//x
function lonToCanvas(lon, phinew) {
    var x = 2 * Math.sin(phinew) * Math.sin(lon);
    //console.log("x: ", x);
    //return (x*90) + 250;
}
//y
function latToCanvas(lon, phinew) {
    var y = 2 * Math.sin(phinew) * Math.cos(lon);
    //console.log("y: ", y);
    //return (y*90) + 250;
}





