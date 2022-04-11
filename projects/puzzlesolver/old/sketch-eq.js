const c = 18;
let dots = [];
const dotAmount = 2000;
let equalizer;

function setupSketch() {
  createCanvas(canvasWidth, canvasHeight);
  angleMode(DEGREES);
  colorMode(HSB);
  background(0);

  equalizer = new EQ(analyzer);
  if (useMic !== true) {
    song.play();
  }
}

const scale = 0.9;
const offsetX = canvasW * (1 - scale);
const offsetY = canvasH * (1 - scale);
let counter = 0;
function draw() {
  counter++;
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
  const boxH = ((canvasHeight * scale) / equalizer.historPeaks.length);
  const boxW = ((canvasWidth * scale) / limit);
  eqs.forEach((eq) => {
    eq.forEach((row, index) => {
      push();
      translate(offsetX + index * boxW, offsetY + depth);
      fill(256 - (255 * row), 255, 120, row);
      rect(0, 0, boxW + 1, boxH + 1);
      pop();
    });
    depth += boxH;
  });  

  debug({
    limit,
    canvasWidth,
    canvasHeight,
    mouseX,
    mouseCX,
    mouseY,
    mouseCY,
    calc: (sqrt(PI / (counter * 40))),
  });
}

function getLevel(treshold, band) {
  var level = map(analyzer.getEnergy(band || 'treble'), 0, 255, 0, 1);
  var returnLevel = level > (treshold / 100) ? level : 0.001;
  return returnLevel;
}
