const scl = 5;
let pixelate;
let imageInfo = [];
let levelCounter = -5;
// function draw() {

function setupSketch() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);
  background(0);
  
  pixelate = createImage(floor(img.width / scl), floor(img.height / scl));
  pixelate.copy(img, 0, 0, img.width, img.height, 0, 0, floor(img.width / scl), floor(img.height / scl));
  for (var x = 0; x < pixelate.width; x++) {
    for (var y = 0; y < pixelate.height; y++) {
      const b = brightness(pixelate.get(x, y));
      if (b > 250) {
        imageInfo[x + y * pixelate.width] = b;
      }
    }
  }

  const eq = analyzer.analyze();
  const level = getLevel(1, 'treble');
  const levelHigh = getLevel(1, 'highMid');
  const levelLow = getLevel(1, 'lowMid') * 0.8;

  background(0);
  levelCounter += level > 0.3 ? -0.01 : 0.01;
  for (var x = 0; x < pixelate.width; x++) {
    for (var y = 0; y < pixelate.height; y++) {
      const brightnessPixel = imageInfo[x + y * pixelate.width];
      push();
      translate(-pixelate.width * 2, 0);
      fill(255, brightnessPixel); //
      ellipse(x * scl, y * scl, scl, scl);
      pop();
    }
  }
  debug({
    width: pixelate.width,
    height: pixelate.height,
    levelCounter,
    length: imageInfo.length,
    // freqMax,
    level: Number(level).toFixed(5),
    levelHigh: Number(levelHigh).toFixed(5),
    levelLow: Number(levelLow).toFixed(5),
    // avg,
  });
}