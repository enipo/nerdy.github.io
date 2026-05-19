// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/IKB1hWWedMk

// Edited by SacrificeProductions

var cols, rows;
var scl = 20;
var flying = 0;
var w, h;

var terrain = [];

function setupSketch() {
  createCanvas(canvasWidth, canvasWidth, WEBGL);
  colorMode(HSB);
  // imageMode(CENTER);
  angleMode(DEGREES);

  w = canvasWidth - 40;
  h = canvasHeight - 40;
  cols = w / scl;
  rows = h/ scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
  var yoff = flying;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff + yoff, xoff + frameCount), 0, 1, -100, random(0, 190));
      xoff += 0.2;
    }
    yoff += 0.2;
  }
}

function draw() {
  background(0);
  const c = abs(sin(frameCount * 0.4));
  // flying -= 0.1;

  const pointLightX = 0; //(sin(frameCount * 0.8) * 160)
  const pointLightY = - canvasHeight; //(cos(frameCount * 0.8) * 360) - canvasH / 2
  const pointLightZ = 600;

  const v = createVector(pointLightX, pointLightY, pointLightZ);
  ambientLight(170, 50, 25, .5);
  pointLight(195, 50, 255, v);

  // if (mouseCX) {
    push();
    noStroke();
    fill(255, 0, 215, 1);
    translate(pointLightX, pointLightY, pointLightZ);
    sphere(10);
    pop();
  // }
  
  translate(-canvasW, -canvasHeight);
  // fill(255,100,200, 1);
  
  push();
  rotateX(40);
  translate(0, 185);
  ambientMaterial(200, 100, 160, 1);
  // noFill();
  noStroke();
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      vertex(x*scl, y * scl, terrain[x][y]);
      vertex(x*scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
  pop();

  debug({c: c.toFixed(5)});
}
