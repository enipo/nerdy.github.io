const decimals = 3;
let frameRateValue = handleFrameRate();
let currKey;
let mic;
let song;
const imageName = 'assets/mazu-boobs.png';
let img;
let analyzer;
const useMic = false;
const useSound = true;
let angle = 119;

const timeLength = 400;
let timeStart, timeEnd;

let debugField;
let debugEnabled = false;
const newText = [];

let canvasWidth;
let canvasHeight;
let canvasW;
let canvasH;

let mouseCX;
let mouseCY;

let winMouseCX;
let winMouseCY;

function preload() {
  getWindowDimensions();
  if (useSound) {
    if (!useMic) {
      song = loadSound(random([
        // 'assets/Blindsided.mp3',
        // 'assets/Blindsided.mp3',
        // 'assets/Blindsided.mp3',
        // 'assets/Blindsided.mp3',
        // 'assets/Blindsided.mp3',
        // 'assets/Blindsided.mp3',
        // 'assets/Blindsided.mp3',
        // 'assets/Blindsided.mp3',
        // 'assets/escapades.mp3',
        // 'assets/bangbang.mp3',
        // 'assets/mazu - Totem - 01 Poison is the dose.mp3',
        // 'assets/mazu - Totem - 02 Humans as knives.mp3',
        // 'assets/mazu - Totem - 03 Talons sharp.mp3',
        // 'assets/mazu - Totem - 04 Impera.mp3',
        // 'assets/mazu - Totem - 05 Past life.mp3',
        'assets/mazu - Totem - 06 Totem.mp3',
      ]));
    }
  }
  
  img = loadImage(imageName);
  if (typeof preloadSketch === 'function') {
    console.log('Calling custom preload');
    preloadSketch();
  }
}

function progress() {
  return 1 - (timeEnd - second()) / timeLength;
}

function setup() {
  timeStart = second();
  timeEnd = timeStart + timeLength;
  if (useMic) {
    mic = new p5.AudioIn();
    mic.start();

    analyzer = new p5.FFT(0, 64);
    analyzer.setInput(mic);
  } else {
    // analyzer = new p5.Amplitude(0.7);
    analyzer = new p5.FFT(0, 64);
    // Patch the input to an volume analyzer
    analyzer.setInput(song);
  }
  
  debugField = createDiv('').addClass('debug');
  if (!debugEnabled) {
    debugField.addClass('hide');
  }
  frameRate(frameRateValue);
  if (typeof setupSketch === 'function') {
    console.log('Detected custom setup: Calling setupSketch');
    setupSketch();
  } else {
    createCanvas(canvasWidth, canvasHeight);
    angleMode(DEGREES);
    fill(255);
    defaultText();
    draw = defaultDraw;
  }
}

function defaultDraw() {
  analyzer.analyze();
  debug();
  if (typeof setupSketch !== 'function') {
    fill(255 - sin(frameCount) * 155, 100, 150, max(.3, sin(frameCount)));
    defaultText(frameCount);
  }
}

function defaultText() {
  colorMode(HSB);
  background(0);
  textSize(100);
  const t = 'Please create setupSketch()';
  const textW = min(canvasWidth * .9, textWidth(t));
  const maxRatio = min(canvasWidth * .9, textWidth(t)) / textWidth(t);
  if (maxRatio < 1) {
    textSize(100 * maxRatio);
  }
  text(t, canvasW - (textWidth(t) / 2), canvasH);
}

function debug(text, title = '') {
  if (!debugEnabled) return;
  if (title) {
    newText[title] += `<h3>${title}</h3>`;
  }
  newText.frameRate = `<span>frameRate</span>:
                ${frameRate().toFixed(2)}<br />`;
  
  Object.keys(text || {}).forEach(function(key) {
    newText[key] = `<span>${key}</span>: 
      ${String(text[key]).split(',').join('<br />')}<br />`;
  });
  debugField.html(Object.values(newText).join(''));
}

function mousePressed() {
  mouseCX = mouseX - (canvasW);
  mouseCY = mouseY - (canvasH);
  winMouseCX = winMouseX;
  winMouseCY = winMouseY;
}
function mouseDragged() {
  mouseCX = mouseX - (canvasW);
  mouseCY = mouseY - (canvasH);
  debug({
    mouseCX,
    mouseCY,
  });
}

function mouseReleased() {
  mouseCX = null;
  mouseCY = null;
}

function keyPressed() {
  console.log('PRESSING KEY!', keyCode);
  if (typeof sketchKeyPressed === 'function') {
    if (!sketchKeyPressed(keyCode)) {
      return false;
    }
  }
  switch(keyCode) {
    case 70:
      handleFrameRate(true);
      break;
    case 71:
      handleFrameRate(false);
      break;
    case 90:
      rotateX()
      break;
    case 71:
      handleFrameRate(false);
      break;
    case 68:
      debugEnabled = !debugEnabled;
      if (debugEnabled === true) {
        debugField.removeClass('hide');
      } else {
        debugField.addClass('hide');
      }
      break;
    case 80:
      if (!useMic) {
        song.isPlaying() ? song.pause() : song.play();
      }
      break;
  }
  // return false; // prevent default
}

function handleFrameRate(dir) {
  let fr = parseInt(localStorage.getItem('frameRateValue'), 10);
  if (typeof dir === 'undefined') {
    return fr;
  }
  const steps = fr <= (10 - dir) ? 1 : 5;
  fr = dir === true ? fr + steps : fr-steps;
  fr = max(0, min(60, fr));
  localStorage.setItem('frameRateValue', fr);
  frameRate(fr);
  console.log('Set framerate to', fr);
}

function getWindowDimensions() {
  canvasWidth = document.body.clientWidth;
  canvasHeight = document.body.clientHeight;
  canvasW = canvasWidth / 2;
  canvasH = canvasHeight / 2;
}
function windowResized() {
  getWindowDimensions();
  resizeCanvas(canvasWidth, canvasHeight);
}

function getLevel(treshold, band) {
  var level = map(analyzer.getEnergy(band || 'treble'), 0, 255, 0, 1);
  var returnLevel = level > (treshold / 100) ? level : 0.001;
  return returnLevel;
}
