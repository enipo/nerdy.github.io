const c = 10;
let dots = [];
const dotAmount = 2000;
const scl = 8;
let imageInfo = [];
let pixelate;

function setupSketch() {
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  angleMode(DEGREES);
  colorMode(HSB);
  background(0);

  pixelate = createImage(floor(img.width / scl), floor(img.height / scl));
  pixelate.copy(img, 0, 0, img.width, img.height, 0, 0, floor(img.width / scl), floor(img.height / scl));
  for (var x = 0; x < pixelate.width; x++) {
    for (var y = 0; y < pixelate.height; y++) {
      imageInfo[x + y * pixelate.width] = brightness(pixelate.get(x, y));
    }
  }
  frameRate(30);
  song.play();
}

function getLevel(treshold, band) {
  var level = map(analyzer.getEnergy(band || 'treble'), 0, 255, 0, 1);
  var returnLevel = level > (treshold / 100) ? level : 0.001;
  return returnLevel;
}

let cameraPosition = 100;
let cameraDirection = 1;
let cameraTilt = 200;
let speedUp = 2;
let speedStuck = 0;
let catchSpeedDown = false;
let historyLevels = [];
let firstTime = 0;
let showShadow = false;
function draw() {
  const level = getLevel(1, 'treble') * 1.1;
  const levelHigh = getLevel(1, 'highMid') * 0.9;
  const levelLow = max(0.2, getLevel(1, 'lowMid'));
  if (level > 0.01) {
    historyLevels.push(level);
  }
  if (historyLevels.length > 180) {
    historyLevels.shift();
  }
  const average = historyLevels.reduce( ( p, c ) => p + c, 0 ) / historyLevels.length || 0.1;
  if(cameraPosition > (300 * speedUp)) {
    cameraDirection = -1;
  } else if (cameraPosition < -500 * speedUp) {
    cameraDirection = 1;
  } else {
    cameraPosition += cameraDirection;
  }
  speedUp += 0.001;
  cameraPosition += cameraDirection * speedUp * 0.01;
  if (abs(cameraPosition) > 950) {
    cameraPosition = 950 * cameraDirection;
    cameraDirection = cameraDirection * -0.001;
    catchSpeedDown = true;
  }
  if (catchSpeedDown) {
    speedUp -= 0.01;
    if (abs(speedUp) < 1.5) {
      catchSpeedDown = false;
    }
  }
  if (abs(cameraPosition) < 19) {
    cameraPosition += -0.8 * cameraDirection;
  }
  if (abs(cameraTilt) > 9000) {
    cameraDirection = cameraDirection * -1;
  } else if( abs(cameraPosition) < 100) {
    cameraTilt -= 0.5;
  } else {
    cameraTilt += 0.5;
  }
  camera(cameraTilt, 0, cameraPosition * (speedUp * 2.4), 0, 0, 0, 0, 0, 10);
  if (abs(cameraPosition) < 100) {
    firstTime++;
  }
  
  if (((levelHigh < 0.4 && level > 0.45) || levelLow > 0.9) && firstTime % 5 !== 1) {
    background(0);
    speedStuck = 0;
    showShadow = false;
  } else if (firstTime % 5 === 1) {
    if (speedUp > 0.8) {
      speedUp -= 0.01;
    } else {
      speedStuck++;
    }
    showShadow = true;
  } else {
    speedStuck++;
    showShadow = true;
  }
  if (speedStuck > 150) {
    firstTime = speedStuck = 0;
    background(0);
    showShadow = false;
  }
  if (level * 100 > 50 && round(random(0, 250)) === 8) {
    background(10);
    showShadow = true;
  }

  angle += average * 0.01;
  const dotColor = parseInt(noise(angle) * (255 * level * 3));
  const crazyMode = (noise(angle) * random(0, 100) > 80);
  const angleRounded = abs(angle - round(angle));
  const ratio = max(0.1, abs(cameraPosition) / (500 * speedUp));
  const forLoopAmount = average > 0.07 ? dotAmount : dotAmount * ratio;
  let prevZ;
  for( var i = forLoopAmount; i > 0; i--) {
    const a = i * angle;
    const r = c * (i / PI);
    const r2 = c * sqrt(i);
    const x = r * cos(a);
    const y = r * sin(a);
    const x2 = r2 * cos(a);
    const y2 = r2 * sin(a);
    strokeWeight(0);
    if (i < 1000) {
      push();
      translate(x, y, noise(i / 4, prevZ || i / 4) * (abs(cameraPosition) < 400 ? (400 - abs(cameraPosition)) :  1));
      prevZ = (i / 4);
      fill((i % dotColor), 255, (dotAmount / 255) * (dotAmount / i));
      sphere((c / 2) * ratio * map(levelLow, 0.1, 0.8, 1, 4 * (1 - ratio)));
      pop();
    }
    push();
    translate(y2 * speedUp * (ratio), x2 * speedUp * (ratio), (i / -10) - 200);
    fill(255 - (i % dotColor), 255 * angleRounded / ratio, ((dotAmount / 255) * (dotAmount / i) * angleRounded) * 1.4);
    sphere((c / 2) * ratio);
    pop();
  }

  if (speedStuck === 0 && showShadow) {
    for (var x = 0; x < pixelate.width; x++) {
      for (var y = 0; y < pixelate.height; y++) {
        const brightnessPixel = imageInfo[x + y * pixelate.width];
        if (brightnessPixel > 0.9) {
          push();
          const tx = (-y * scl * 3) - (pixelate.height / 2);
          const ty = (pixelate.width / 2) - (x * scl * 3);
          const tz = 200;
          translate(tx, ty, tz);

          fill(0);
          sphere(scl * 1.5, scl * 1.5);
          pop();
        }
      }
    }
  }

  debug({
    random: random(0, 800),
    average,
    linAverages: analyzer.linAverages(),
    historyLevels: historyLevels.length,
    dotAmountRatio: Number(dotAmount * ratio).toFixed(5),
    ratio: Number(ratio).toFixed(5),
    cameraTilt: Number(cameraTilt).toFixed(5),
    cameraPosition: Number(cameraPosition).toFixed(5),
    cameraLimit: Number((300 * speedUp)).toFixed(5),
    cameraDirection: Number(cameraDirection).toFixed(5),
    level: Number(level).toFixed(5),
    levelHigh: Number(levelHigh).toFixed(5),
    levelLow: Number(levelLow).toFixed(5),
    angle: Number(angle).toFixed(5),
    speedUp: Number(speedUp).toFixed(5),
    speedStuck,
    firstTime,
  });

}