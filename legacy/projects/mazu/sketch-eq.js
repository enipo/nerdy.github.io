const c = 18;
let dots = [];
let equalizer;
const scale = .9;
let offsetX;
let offsetY;

function setupSketch() {
  createCanvas(canvasWidth, canvasHeight);
  angleMode(DEGREES);
  colorMode(HSB);
  background(0);

  equalizer = new EQ(analyzer);
  if (useMic !== true) {
    song.play();
  offsetX = canvasW * (1 - scale);
  offsetY = canvasH * (1 - scale);
  }
  offsetX = canvasW * (1 - scale);
  offsetY = canvasH * (1 - scale);
}

function draw() {
  defaultDraw();
  background(1);
  equalizer.update();
  const level = getLevel(1, 'treble');
  const levelHigh = getLevel(1, 'highMid');
  const levelLow = getLevel(1, 'lowMid') * 0.8;
  noStroke();
  const eqs = equalizer.getFrequencies();
  const limit = equalizer.getBands();
  const last = eqs.length;
  let depth = 0;
  if (equalizer.historPeaks.length) {
    const boxH = ((canvasHeight * scale) / equalizer.historPeaks.length);
    const boxW = ((canvasWidth * scale) / limit);
    eqs.forEach((eq) => {
      eq.forEach((row, index) => {
        push();
        translate(offsetX + index * boxW, offsetY + depth);
        fill(255 - (255 * row), 255, 120, row);
        rect(0, 0, boxW + 1, boxH + 1);
        pop();
      });
      depth += boxH;
    });  
  }

  debug({
    limit,
    level,
    levelHigh,
    levelLow,
    canvasWidth,
    canvasHeight,
    canvasW,
    canvasH,
    mouseX,
    mouseCX,
    mouseY,
    mouseCY,
  });
}
