let modelArr = [];
let imageInfo = JSON.parse(localStorage.getItem('pixelateCache'));
const scl = 4;

let sumX = 0;
let sumY = 0;
let sumCount = 0;

function setupSketch() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);
  background(0);
  imageMode(CENTER);

  if (imageInfo.length === 0) {
    let pixelate = createImage(floor(img.width / scl), floor(img.height / scl));
    console.log('Creating image array', pixelate.width);
    pixelate.copy(img, 0, 0, img.width, img.height, 0, 0, floor(img.width / scl), floor(img.height / scl));
    for (var x = 0; x < pixelate.width; x++) {
      console.log('Scanning rows: ', x);
      for (var y = 0; y < pixelate.height; y++) {
        const b = brightness(pixelate.get(x, y)); 
        imageInfo[x + y * pixelate.width] = b;
      }
    }
    const w = floor(img.width / scl);
    const newImageInfo = [];
    for (let x = 0; x < w; x++) {
      console.log('Gutting image');
      for (let y = 0; y < floor(img.height / scl); y++) {
        if(findClearPx(x, y, 50)) {
          const index = x + y * w;
          newImageInfo[index] = imageInfo[index];
        }
      }
    }
    // imageInfo = newImageInfo;
    localStorage.setItem('pixelateCache', JSON.stringify(newImageInfo));
    imageInfo = [];
    imageInfo = newImageInfo;
    console.log('Done', imageInfo);
  }

}

function findClearPx(x, y, b = 20) {
  const w = floor(img.width / scl);
  const h = floor(img.height / scl);
  if(x === 0 || y === 0 || x === w || y === h) return true;
  if(x < 0 || y < 0 || x > w || y > h) return false;
  const west = (x - 1) + y * w;
  const east = (x + 1) + y * w;
  const north = (x) + (y - 1) * w;
  const south = x + (y + 1) * w;
  console.log(imageInfo[west], imageInfo[east], imageInfo[north], imageInfo[south]);
  if((imageInfo[west] > b || imageInfo[west] === undefined)
    && (imageInfo[east] > b || imageInfo[east] === undefined)
    && (imageInfo[north] > b || imageInfo[north] === undefined) 
    && (imageInfo[south] > b || imageInfo[south] === undefined)) return false;
  return true;
}

let zoom = 3;
let rotatorZ = .1;
let zRatio = 0;
let spotlightStatic = false;
let zAxis = 0;
let yAxis = 0;
function draw() {
  defaultDraw();
  let level = 1;
  const sinusor = 2.5 + (cos(counter * 0.08) * 20);
  if (sinusor >= 2.5) {
    background(0);
    zoom = sinusor;
    spotlightStatic = false;
    zAxis = (zAxis - random(0.09, .1)) % 360;
    yAxis = (yAxis - random(0.008, .01)) % 360;
    zRatio = min(1.4, zRatio + random(0.01, 0.2));
    rotatorZ = .1;
  } else {
    level = (getLevel(50)) * 2 + 1;
    background(0);
    zRatio = max(0.01, zRatio - .5);
    rotatorZ+= 0.01;
    zAxis = (zAxis - map(zAxis, 0, 360, 1, 2) * rotatorZ) % 360;
    yAxis = (yAxis - map(yAxis, 0, 360, 1, 2) * rotatorZ) % 360;
    spotlightStatic = true;
  }
  if (mouseCY) {
    rotateX(-mouseCY);
    rotateY(mouseCX);
  }
  scale(zoom);
  
  // rotateY(0);
  // rotateZ(0.1 * counter);
  const pointLightX = spotlightStatic ? 0 : cos(-counter * rotatorZ) * 100; // mouseCX || 
  const pointLightY = spotlightStatic ? 0 : sin(-counter * rotatorZ * 2) * 170; // mouseCY || 
  const pointLightZ = spotlightStatic ? -100 : (sin(-counter * 0.1) * 100) * -zoom; // mouseCY ? 
  const v = createVector(pointLightX, pointLightY, pointLightZ);
  ambientLight(150, 255, map(sin(counter / 10), 0, 1, 75, 40), map(sin(counter / 10), 0, 1, 0.3, 0.8));
  pointLight(sin((counter + 300) * 0.04) * 255, 255, 255, v);
  if (mouseCX) {
    push();
    fill(30);
    translate(pointLightX, pointLightY, pointLightZ);
    sphere(10);
    pop();
  }
  
  rotateZ(zAxis);
  rotateY(yAxis);
   
  counter++;
  const w = floor(img.width / scl);
  const h = floor(img.height / scl);
  // stroke(255, 0, 0);
  // strokeWeight(10);
  translate(-w / 2, -h / 2);
  // rotate(HALF_PI, createVector(0, 0));
  const middle = getAvg();
  sumX, sumY = 0;
  // beginShape();
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      const b = imageInfo[x + y * w];
      if (b) {
        sumX += x;
        sumY += y;
        sumCount++;
        push();
        // translate();
        // sphere(1);
        const z = (sin(y * x) * zoom * zoom) * zRatio;
        if (level > 1) {
          translate((x + x + x + middle.x) * 0.25, (y + y + y + middle.y) * 0.25, z); //  / abs(sin(counter * 0.1))
        } else {
          translate(x, y, z); //  / abs(sin(counter * 0.1))
        }
        // stroke(255);
        noStroke();
        // vertex(0, 0);
        // fill(250, 255, 255, (imageInfo[x + y * w] / 255));
        ambientMaterial(cos(counter * 0.006) * 255, 230, 235, 1); //1.4 - abs(sin(imageInfo[x + y * w]) / 2)
        box(2, 2, zoom);
        
        // translate(0, 0, 3);
        // sphere(3, 24, 24, 24);
        // translate(0, 0, 3);
        // sphere(1, 24, 24, 24);
        pop();
      }
    }
  }
  getAvg();
  // endShape(CLOSE);
  debug({
    counter,
    mouseCX,
    mouseCY,
    level,
  });
}

function getAvg() {
  if (sumCount != 0) {
    push();
    let avgX = sumX / sumCount;
    let avgY = sumY / sumCount;
    debug({
      sumX,
      sumY,
      sumCount,
      avgX,
      avgY,
    });
    fill(255, 255, 255, 1);
    translate(avgX, avgY, -500);
    // ellipse(0, 0, 30);
    pop();
    return { x: avgX, y: avgY };
  }
  return false;
}

function sketchKeyPressed(keyCode) {
  if (keyCode === 76) {
    localStorage.setItem('pixelateCache', JSON.stringify([]));
  }
  return true;
}
