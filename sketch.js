// Move sensitivity
const MOVE_SENS = 5;
const AVILIATIONS = 1000;
const CANVAS_W = 500;
const CANVAS_H = 500;

let points = [];
let curvePoints = [];
let auxPoints = [];

let isMoving = false;
let moveIndex = 0;

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background('beige');
  
  let params = [];

  for (const [i, item] of points.entries()) {
    stroke('red');
    strokeWeight(5);
    point(item.x, item.y);
    params.push(item.x, item.y);
    if (i > 0) {
      stroke('black');
      strokeWeight(2);
      line(points[i - 1].x, points[i -1].y, item.x, item.y);
    }
  }
  
  if (points.length > 2) {
    deCasteljau();
    strokeWeight(2);
    
    stroke('red');
    for (let i in curvePoints) {
      if (i > 0) {
        line(curvePoints[i - 1].x, 
             curvePoints[i - 1].y, 
             curvePoints[i].x, 
             curvePoints[i].y);
      }    
    }
    noStroke();
    
  }
  
}

function deCasteljau() {
  curvePoints = [];
  auxPoints = [];
  for (let c = 1; c < AVILIATIONS; c++){
    for(let p of points){
      auxPoints.push(p);
    }
    curvePoints.push(getCurvePoint(c/AVILIATIONS));
  }
}

function getCurvePoint (t) {
  if (auxPoints.length == 1){
    return auxPoints[0];
  } else {
    let auxPointsTemp=[];
    
    for (let i in auxPoints) {
      if (i != 0) {
        auxPointsTemp.push({x: (auxPoints[i-1].x * (1-t)) + (auxPoints[i].x * t), y: (auxPoints[i-1].y * (1-t)) + (auxPoints[i].y * t)})
      }
    }
    auxPoints=[];
    
    for (i in auxPointsTemp) {
      auxPoints.push(auxPointsTemp[i]);
    }

    return getCurvePoint(t);
  }
}

function degreeElevation() {
  auxPoints = [];
  for (let p of points) {
    auxPoints.push(p);
  }
  var n = points.length - 1;
  var a;
  var b;
  points = [];
  curvePoints = [];

  points.push(auxPoints[0]);
  for (let i = 1; i <= n; i++) {
    a = i / (n + 1);
    b = 1 - a;
    points.push({x: (a * auxPoints[i-1].x) + (b * auxPoints[i].x) , y: (a * auxPoints[i-1].y) + (b * auxPoints[i].y)});   
  }
  points.push(auxPoints[n]);

  //draw();
}

function mouseDragged() {
  if (isMoving) {
    points[moveIndex].x = mouseX;
    points[moveIndex].y = mouseY;
  }
}

function mousePressed() {
  
  for (const [i, item] of points.entries()) {
    point(item.x, item.y);
    if (abs(item.x - mouseX) <= MOVE_SENS && 
        abs(item.y - mouseY) <= MOVE_SENS) {
      moveIndex = i;
      isMoving = true;
      return;
    }
  }
  if (mouseX <= CANVAS_H && mouseY <= CANVAS_W)
  points.push({x : mouseX, y: mouseY});
  
}

function mouseReleased() {
  isMoving = false;
}