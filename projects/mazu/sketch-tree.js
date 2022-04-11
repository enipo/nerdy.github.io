let chair;
let view;
const preloadSketch = () => {
  chair = loadModel('assets/SVG/boobs2.obj');
}

const setupSketch = () => {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  colorMode(HSB);
  imageMode(CENTER);
  angleMode(DEGREES);

  view = new viewController();
  // view.set(0, -364, -10, -100);
  view.pan(44, true);
  view.tilt(790, true);
  view.update();
}

function draw() {
  defaultDraw();
  background(10);

  if (mouseCX) {
    view.pan(mouseCX - 400 || 0, true);
    view.tilt(mouseCY - 400 || 0, true);
  }
  
  debug({
    camera: view.debugInfo(),
  })

  const pointLightX = -104;
  const pointLightY = -70;
  const pointLightZ = 300;

  const v = createVector(pointLightX, pointLightY, pointLightZ);
  ambientLight(140, 55, 30, 0.1);
  pointLight(165, 255, 255, v);

  if (mouseCX) {
    push();
    fill(30);
    translate(pointLightX, pointLightY, pointLightZ);
    sphere(10);
    pop();
  }

  view.update();
  rotateY(0);
  rotateZ(0);

  push();
  scale(140);
  noStroke();
  ambientMaterial(215, 255, 255, 1); 
  translate(mouseCX || 0, -mouseCY || 0, -1);
  rotateX(180);
  model(chair);
  pop();
  // push();
  // scale(9);
  // noStroke();
  // ambientMaterial(15, 255, 265, 0.6); 
  // rotateX(90);
  // translate(0, 0, 5);
  // plane(100, 100);
  // pop();
  push();
  scale(9);
  noStroke();
  ambientMaterial(215, 155, 65, 1); 
  translate(0, -0.8, -1);
  model(chair);
  pop();  
}