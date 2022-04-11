const scl = 8;
let imageInfo = [];
let pixelate;
let volumeHistory = 600;
let alwaysCleanBackground = false;
let mute = false;
let freezeMode = false;

let cameraObj;
let disc;

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

  if (!useMic) {
    song.play();
    // song.setVolume(0);
  }

  viewObj = new viewController();
  disc = new Disc();
  directionalLight(255, 255, 255, 0, -1, 0);
  ambientLight(255, 255, 255);
}

let speedUp = 1;
let speedStuck = 0;
let level = { low: 0.0, mid: 0.0, high: 0.0 };
let levelAverage = { low: 0.0, mid: 0.0, high: 0.0 };
let levelMax = { low: 0.0, mid: 0.0, high: 0.0 };
let historyLevels = { low: [], mid: [], high: [] };
let firstTime = 0;
let loudScore = 0;
function draw() {
  const timePast = (millis()) / 1000;
  defaultDraw();

  doVolume();
  speedUp += 0.001;
  const sinus = sin(frameCount * 0.1) * ((levelAverage.mid) * 3);
  const cosinus = sin(frameCount * 0.1) * ((levelAverage.low) * 2) * levelObj().low;

  if (frameCount === 1) {
    viewObj.set(10, 1000, 0, 0);
  } else {
    const buildUp = min(1, (timePast / 30));
    if (timePast > 59) {
      viewObj.zoom((-sinus / 2) * 0.001 * speedUp * buildUp);
      viewObj.pan(sinus * 0.05 * speedUp * buildUp);
      viewObj.tilt(sinus * 0.07 * speedUp * buildUp);
      viewObj.pivot(cosinus * 0.01 * speedUp * buildUp);
    } else if (timePast > 50) {
      viewObj.zoom(-0.01);
    } else if (timePast > 25) {
      viewObj.zoom((cosinus / 2) * 0.01 * speedUp * buildUp);
    }
  }

  viewObj.schedule('zoom', 11, 3, 0.5);
  viewObj.schedule('zoom', 12, 3, 0.4);
  viewObj.schedule('zoom', 13, 3, 0.3);
  viewObj.schedule('zoom', 14, 3, 0.2);
  viewObj.schedule('x', 17, 3, 900);
  viewObj.schedule('y', 24, 10, -700);
  viewObj.schedule('z', 24, 10, 300);
  viewObj.schedule('z', 44, 10, 500);
  viewObj.schedule('pan', 50, 1, 50);
  viewObj.schedule('zoom', 50, 30, 0.3);
  
  viewObj.interactive();
  viewObj.update(timePast);
  
  if (timePast > 50 && timePast < 180) {
    firstTime++;
  }
  
  const magicNumber = 120;
  const closeToWeird = (abs(magicNumber - Number(angle % (magicNumber * 2))) / magicNumber);
  angle += levelAverage.mid * 50 * max(0.05, closeToWeird) * max(0.05, closeToWeird) * max(0.05, closeToWeird);

  const disc1BeGone = disc.showDisc1 ? random(0, 20) > 1 : true;
  const disc2BeGone = disc.showDisc2 ? random(0, 20) > 1 : true;
  
  const blurChance = 0.65 * random(1, 1 + cos(frameCount * 0.4));
  if (levelObj().all > blurChance || alwaysCleanBackground) {
    background(0);
    speedStuck = 0;
    disc.setShowDisc(disc1BeGone, disc2BeGone);
  }
  if (levelAverage.mid < 0.25) { 
    background(0);
    speedStuck = 0;
  }
  const lowLevelMaxCalc = levelObj().low > levelMax.low;
  let changeSpeedStuck = round(random(0, 500 / speedStuck)) === 1;
  if (lowLevelMaxCalc) {
    if (changeSpeedStuck) {
      background(0);
      speedStuck = 0;
    }
  }

  if (closeToWeird < 0.001) { //firstTime % 5 !== 1 || 
    background(0);
    speedStuck = 0;
    disc.setShowDisc(true, true);
  } else if (firstTime % 5 === 1) {
    if (speedUp > 0.8) {
      speedUp -= 0.01;
    } else {
      speedStuck++;
    }
  } else {
    speedStuck++;
  }
  if (speedStuck > 500) {
    disc.setShowDisc(disc1BeGone, disc2BeGone);
    firstTime = speedStuck = 0;
    background(0);
  }
  // background(0);

  disc.setZoom(viewObj.scale);
  const calcLoud = levelAverage.high - (levelMax.high * 0.85);
  loudScore = calcLoud > 0 ? loudScore + 0.01 : max(0, loudScore - 0.01);
  freezeMode = false;
  if (loudScore > 1 && loudScore <= 2 && timePast > 30) {
    disc.setAngle(angle * (speedUp * 0.1));
  } else if (loudScore > 2) {
    freezeMode = true;
    loudScore -= 0.0048 * loudScore;
  } else {
    disc.setAngle(angle * 1.0001);
  }
  disc.setBaseColor(floor(noise(angle) * (255 * levelObj().mid * 3)));
  disc.setLevels(levelObj().low, levelObj().mid, levelObj().high);
  disc.show();

  const cosinusRatio = cos(frameCount * 0.06);
  for (var x = 0; x < round(pixelate.width * cosinusRatio); x++) {
    for (var y = 0; y < pixelate.height; y++) {
      const brightnessPixel = imageInfo[x + y * pixelate.width];
      if (brightnessPixel > 0.9) {
        push();
        const tx = x * scl * 2 * cosinusRatio;
        const ty = (y * cosinusRatio) * scl * 2 * cosinusRatio;
        const tz = -400;
        translate(tx - 100, ty + (1000 * sin(frameCount * 0.04)), tz);

        fill(0);
        sphere(round(scl / 5), round(scl / 5));
        pop();
      }
    }
  }

  debug({
    timePast: timePast.toFixed(0),
    disc1BeGone: Number(disc1BeGone).toFixed(decimals),
    disc2BeGone: Number(disc2BeGone).toFixed(decimals),
    changeSpeedStuck: Number(changeSpeedStuck).toFixed(decimals),
    sinus: sinus.toFixed(decimals),
    pixelate: pixelate.width,
    random: random(0, 800).toFixed(decimals),
    // linAverages: analyzer.linAverages(),
    blurChance: Number(blurChance).toFixed(decimals),
    levelAll: Number(levelObj().all).toFixed(decimals),
    levelMid: Number(levelObj().mid).toFixed(decimals),
    levelHigh: Number(levelObj().high).toFixed(decimals),
    levelLow: Number(levelObj().low).toFixed(decimals),
    levelAveragemid: Number(levelAverage.mid).toFixed(decimals),
    levelAveragehigh: Number(levelAverage.high).toFixed(decimals),
    levelAveragelow: Number(levelAverage.low).toFixed(decimals),
    levelMaxmid: Number(levelMax.mid).toFixed(decimals),
    levelMaxhigh: Number(levelMax.high).toFixed(decimals),
    levelMaxlow: Number(levelMax.low).toFixed(decimals),
    lowLevelMaxCalc: Number(lowLevelMaxCalc).toFixed(decimals),
    loudScore: Number(loudScore).toFixed(decimals),
    calcLoud: Number(calcLoud).toFixed(decimals),
    angle: Number(angle).toFixed(decimals),
    angle10: (abs(5 - Number(angle % 10)) / 5).toFixed(decimals),
    closeToWeird: Number(closeToWeird).toFixed(decimals),
    speedUp: Number(speedUp).toFixed(decimals),
    speedStuck: Number(speedStuck).toFixed(decimals),
    firstTime: Number(firstTime).toFixed(decimals),
    camera: viewObj.debugInfo(),
    discs: disc.debugInfo(),
  });
  // if (levelAverage.mid < 0.01) {
  //   background(0);
  // };
}

function doVolume() {
  level.mid = map(analyzer.getEnergy('treble'), 0, 255, 0, 1) * random(0.9, 0.99);
  level.high = map(analyzer.getEnergy('highMid'), 0, 255, 0, 1) * random(0.9, 0.99);
  level.low = map(analyzer.getEnergy('lowMid'), 0, 255, 0, 1) * random(0.9, 0.99);
  historyLevels.low.push(level.low);
  historyLevels.mid.push(level.mid);
  historyLevels.high.push(level.high);
  if (historyLevels.length > volumeHistory) {
    historyLevels.shift();
  }
  levelAverage.low = historyLevels.low.reduce((p, c ) => p + c) / historyLevels.low.length || 0.1;
  levelAverage.mid = historyLevels.mid.reduce((p, c ) => p + c) / historyLevels.mid.length || 0.1;
  levelAverage.high = historyLevels.high.reduce((p, c ) => p + c) / historyLevels.high.length || 0.1;

  levelMax.low = max((levelMax.low * (volumeHistory - 1) + levelAverage.low) / volumeHistory, level.low);
  levelMax.mid = max((levelMax.mid * (volumeHistory - 1) + levelAverage.mid) / volumeHistory, level.mid);
  levelMax.high = max((levelMax.high * (volumeHistory - 1) + levelAverage.high) / volumeHistory, level.high);

  const averageAvg = (levelAverage.low + levelAverage.mid + levelAverage.high) / 3;
  const levelAvg = (level.mid + level.high + level.low) / 3;
  level.all = (averageAvg + levelAvg * 3) / 4;
}

function levelObj() {
  return mute || freezeMode ? {low: 0, mid: 0, high: 0, all: 0} : level;
}
function getLevelAverage() {
  return mute || freezeMode ? {low: 0, mid: 0, high: 0} : levelAverage;
}
function getLevelMax() {
  return mute || freezeMode ? {low: 0, mid: 0, high: 0} : levelMax;
}

function sketchKeyPressed() {
  switch(keyCode) {
    case ENTER:
      alwaysCleanBackground = !alwaysCleanBackground;
      break;
    case 77:
      mute = !mute;
      break;
  }

  return viewObj && viewObj.keys(keyCode); // prevent default
}
