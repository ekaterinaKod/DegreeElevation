const degreeText = document.getElementById('degreeText');
const degreeAddBtn = document.getElementById('degreeAddBtn');
const showBezierCurveBtn = document.getElementById('showBezierCurveBtn');
const showControlPointsBtn = document.getElementById('showControlPointsBtn');
const showControlPolygonalBtn = document.getElementById('showControlPolygonalBtn');
const userGuideText = document.getElementById('userGuideText');


const MOVE_SENS = 5;
const AVILIATIONS = 1000;
const CANVAS_W = 600;
const CANVAS_H = 600;

let points = [];
let curvePoints = [];
let auxPoints = [];

let isMoving = false;
let moveIndex = 0;

function setup() {
  createCanvas(CANVAS_W, CANVAS_H);
}

function draw() {
  background('#CFCFCF');

  for (const [i, item] of points.entries()) {
    if (showControlPointsBtn.checked) {
      stroke('red');
      strokeWeight(7);
      point(item.x, item.y);
    }
    if (i > 0 && showControlPolygonalBtn.checked) {
      stroke('black');
      strokeWeight(2);
      line(points[i - 1].x, points[i -1].y, item.x, item.y);
    }
  }
  
  if (points.length > 2 && showBezierCurveBtn.checked) {
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
    
    for (let i in auxPointsTemp) {
      auxPoints.push(auxPointsTemp[i]);
    }

    return getCurvePoint(t);
  }
}

function degreeElevation() {
  if (points.length < 3) return;

  auxPoints = [];
  for (let p of points) {
    auxPoints.push(p);
  }
  let n = points.length - 1;
  let a;
  let b;
  points = [];
  curvePoints = [];

  points.push(auxPoints[0]);
  for (let i = 1; i <= n; i++) {
    a = i / (n + 1);  
    b = 1 - a;
    points.push({x: (a * auxPoints[i-1].x) + (b * auxPoints[i].x) , y: (a * auxPoints[i-1].y) + (b * auxPoints[i].y)});   
  }
  points.push(auxPoints[n]);

  setDegreeData();
}

function setDegreeData() {
  degreeText.textContent = points.length > 2 ? points.length - 1 : 'Ø';
  if (points.length > 2) {
    degreeAddBtn.removeAttribute('disabled');
  } else {
    degreeAddBtn.setAttribute('disabled', true);
  }
}

function clearScreen() {
  points = [];
  curvePoints = [];
  auxPoints = [];
  setDegreeData();
}

function mouseDragged() {
  if (isMoving) {
    if (mouseX >= 0 && mouseX <= CANVAS_W)
      points[moveIndex].x = mouseX;
    if (mouseY >= 0 && mouseY <= CANVAS_H)
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

  if (mouseX >= 0 && mouseX <= CANVAS_H &&
      mouseY >= 0 && mouseY <= CANVAS_W) {
    points.push({x : mouseX, y: mouseY});
    setDegreeData();
  }

}

function mouseReleased() {
  isMoving = false;
}

// function toggleUserGuideText() {
//   if (userGuideText.style.display === "none") {
//     userGuideText.style.display = "block";
//   } else {
//     userGuideText.style.display = "none";
//   }
// }