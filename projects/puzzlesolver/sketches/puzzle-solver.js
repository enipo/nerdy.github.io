/* global createSlider createSpan createElement localStorage min canvasWidth
  canvasHeight redraw createCanvas colorMode HSB background frameRate frameCount
  createButton noLoop translate color stroke push pop line noStroke textSize
  fill text ellipse debug textAlign CENTER
   */


let cols = Number(localStorage.getItem('puzzleSolver.d.colSlider')) || 19;
let rows = Number(localStorage.getItem('puzzleSolver.d.rowSlider')) || 11;

let boxW = 0;
let boxH = 0;

let gridWidth = 1200;
let gridHeight = 1000;

let wordObj;

const d = [];
const selectedRow = [];
const selectedRowAlts = [];
const selectedRowCounter = [];

const oldwords = [
  'verbeelden',
  'demagoog',
  'correspondent',
  'veelvraat',
  'deeltijdbaan',
  'professor',
  'dirkvanderbroek',
  'thuiszorg',
  'gerardreve',
  'papierloos',
  'parelgrijs',
  'opfrissertje',
  'parkgedeelte',
  'parkwachters',
  'parlementair',
  'parodistisch',
  'parodontitis',
  'parterrebouw',
  'weekroosters',
];

let words = JSON.parse(localStorage.getItem('puzzleSolver.words')) || oldwords;

const oldVerticalWords = [
  'subjectieve',
  'voortkwamen',
  'piratenboot',
  'worstelperk',
];

let verticalWords =
  JSON.parse(localStorage.getItem('puzzleSolver.verticalWords')) ||
  oldVerticalWords;

let usedWords = [];
let unusedWords = [];

function handleDimensions() {
  gridWidth = min(canvasWidth - 400, gridWidth);
  gridHeight = min((gridWidth / gridHeight) * gridWidth, canvasHeight - 200);

  boxW = gridWidth / (cols + 1);
  boxH = gridHeight / (rows + 1);

  const domArr = Array.from(d);
  domArr.forEach(el => el.remove);

  const defaultColSlider = Number(localStorage.getItem('puzzleSolver.d.colSlider')) || 19;
  d.colSlider = createSlider(8, 40, defaultColSlider, 1);
  d.colSlider.position(canvasWidth - 270, 40).style('width', '250');
  const defaultRowSlider = Number(localStorage.getItem('puzzleSolver.d.rowSlider')) || 11;
  d.rowSlider = createSlider(6, 40, defaultRowSlider, 1);
  d.rowSlider.position(canvasWidth - 270, 120).style('width', '250');

  d.colSliderText = createSpan('Set columns')
    .position(canvasWidth - 270, 20)
    .style('color', 'white');
  d.rowSliderText = createSpan('Sel rows')
    .position(canvasWidth - 270, 100)
    .style('color', 'white');

  const defaultrSlider = Number(localStorage.getItem('puzzleSolver.d.rSlider'));
  d.rSlider = createSlider(0, verticalWords.length - 1, defaultrSlider, 1);
  d.rSlider.position(20, 40).style('width', '250');
  const defaultWslider = Number(localStorage.getItem('puzzleSolver.d.wSlider'));
  d.wSlider = createSlider(0, cols - 1, defaultWslider, 1);
  d.wSlider.position(20, 120).style('width', '250');

  d.rSliderText = createSpan('Select verticaaltje')
    .position(20, 20)
    .style('color', 'white');
  d.wSliderText = createSpan('Select column')
    .position(20, 100)
    .style('color', 'white');

  let topMargin = 180;
  d.wordInputText = createSpan(`${words.length} words found`)
    .position(canvasWidth - 220, topMargin)
    .style('color', 'white');

  let height = 130;
  d.wordInput = createElement('textarea', words.join('\n'))
    .position(canvasWidth - 220, topMargin + 20)
    .size(200, height);
  d.wordInput.input((evt) => {
    const arr = evt.target.value.split('\n');
    words = arr.filter(w => w);
    words = arr.map(w => w.replace(/\s/g, ''));
    localStorage.setItem('puzzleSolver.words', JSON.stringify(words));
    d.wordInput.value(words.join('\n'));
    redraw();
  });

  topMargin += height + 30;
  height = 70;

  d.verticalWordInputText = createSpan(`${verticalWords.length} vertical words found`)
    .position(canvasWidth - 220, topMargin)
    .style('color', 'white');

  d.verticalWordInput = createElement('textarea', verticalWords.join('\n'))
    .position(canvasWidth - 220, topMargin + 20)
    .size(200, height);
  d.verticalWordInput.input((evt) => {
    const arr = evt.target.value.split('\n');
    verticalWords = arr.filter(w => w);
    verticalWords = arr.map(w => w.replace(/\s/g, ''));
    localStorage.setItem(
      'puzzleSolver.verticalWords',
      JSON.stringify(verticalWords),
    );
    redraw();
  });

  topMargin += height + 30;
  height = 130;

  d.usedWordInputText = createSpan('No used words found yet')
    .position(canvasWidth - 220, topMargin)
    .style('color', 'white');

  d.usedWordInput = createElement('textarea', 'empty.....')
    .position(canvasWidth - 220, topMargin + 20)
    .size(200, height);

  topMargin += height + 30;

  d.unusedWordInputText = createSpan('No unused words found yet')
    .position(canvasWidth - 220, topMargin)
    .style('color', 'white');

  d.unusedWordInput = createElement('textarea', 'empty.....')
    .position(canvasWidth - 220, topMargin + 20)
    .size(200, height);

  d.rowButtons = [];
}

// eslint-disable-next-line no-unused-vars
function setupSketch() {
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSB);
  redraw();
}

function drawButtons(x0, y0) {
  for (let i = 0; i < rows; i += 1) {
    if (d.rowButtons[i]) d.rowButtons[i].remove();
  }
  cols = d.colSlider.value();
  rows = d.rowSlider.value();
  boxW = gridWidth / (cols + 1);
  boxH = gridHeight / (rows + 1);

  d.rowButtons = [];
  for (let i = 0; i < rows; i += 1) {
    const btn = createButton('skip', i);
    btn.position(x0, y0 + (i * boxH) + (boxH * 0.3));
    btn.style('border:1px solid #fff; background-color: #000; color: #fff; font-size: 13px; cursor: pointer;');
    btn.mousePressed(() => {
      selectedRow[i + 1] += 1;
      selectedRowCounter[i + 1] += 1;
      selectedRow[i + 1] %= selectedRowAlts[i + 1];
      redraw();
    });
    d.rowButtons[i] = btn;
  }

  localStorage.setItem('puzzleSolver.d.colSlider', d.colSlider.value());
  localStorage.setItem('puzzleSolver.d.rowSlider', d.rowSlider.value());
  d.colSliderText.html(`Set columns: ${d.colSlider.value()}`);
  d.rowSliderText.html(`Set rows: ${d.rowSlider.value()}`);

  localStorage.setItem('puzzleSolver.d.rSlider', d.rSlider.value());
  localStorage.setItem('puzzleSolver.d.wSlider', d.wSlider.value());
  d.rSliderText.html(`Select verticaaltje: ${verticalWords[d.rSlider.value()]}`);
  d.wSliderText.html(`Select column: ${d.wSlider.value()}`);

  d.unusedWordInputText.html(`${unusedWords.length} unused words found`);
  d.unusedWordInput.value(unusedWords.join('\n'));

  d.usedWordInputText.html(`${usedWords.length} used words found`);
  d.usedWordInput.value(usedWords.join('\n'));
}

function charPrinter(countAlts, i, j) {
  push();
  translate(j * boxW, (i * boxH) - boxH);
  const index = (i - 1) + (j * rows);
  const kIndex = selectedRow[i];
  selectedRowAlts[i] = countAlts;

  let returnValue = '';

  if (wordObj.coords[index] && wordObj.coords[index][kIndex]) {
    const char = wordObj.coords[index][kIndex] || '';
    if (char) {
      const textHeight = boxH / 2;
      let charPrint = '';
      if (char !== '-') {
        returnValue = char;
        charPrint = char;
      }
      noStroke();
      push();
      textSize(textHeight);
      fill(wordObj.coordsScore[index] || '' ? 300 : 155, 244, 255, 1);
      textAlign(CENTER);
      text(charPrint, boxW / 2, textHeight);
      pop();

      if (j === 0) {
        push();
        textSize(textHeight / 2);
        fill(countAlts, 244, 125, 1);
        const counterText =
          countAlts < 2 ? '1 / 1' : `${kIndex + 1} / ${countAlts}`;
        text(counterText, -120, (boxH / 2) + 5);
        pop();
      }
    }
  }
  pop();

  return returnValue;
}

// eslint-disable-next-line no-unused-vars
function draw() {
  background(0, 0, 0, 1);
  frameRate(1);
  if (frameCount === 1) {
    handleDimensions();
    background(0, 0, 0, 1);
    redraw();
    return;
  }

  const x0 = 80;
  const y0 = 203;

  // drawButtons(x0, y0);

  if (words.length < 1 || verticalWords.length < 1) {
    return;
  }

  /* eslint-disable-next-line */
  wordObj = new Word(verticalWords[d.rSlider.value()], d.wSlider.value());
  wordObj.loadWords(words);
  wordObj.test();

  translate(140, 200);
  color(255);
  stroke(255);
  let x = 0;
  let y = 0;
  for (let j = 0; j <= rows; j += 1) {
    push();
    y = j * boxH;
    translate(0, y);
    line(0, 0, gridWidth - boxW, 0);
    pop();
  }
  for (let i = 0; i <= cols; i += 1) {
    push();
    x = i * boxW;
    translate(x, 0);
    line(0, 0, 0, gridHeight - boxH);
    pop();
  }
  for (let i = 0; i < cols; i += 1) {
    selectedRow[i] = selectedRow[i] || 0;
    selectedRowAlts[i] = selectedRowAlts[i] || 0;
    selectedRowCounter[i] = selectedRowCounter[i] || 0;
  }

  const rowWords = [];
  for (let i = 1; i < rows + 1; i += 1) {
    let rowWord = '';
    const countAlts = wordObj.coords[(i - 1)] && wordObj.coords[(i - 1)].length;
    for (let j = 0; j < cols; j += 1) {
      rowWord += charPrinter(countAlts, i, j, rowWord);
    }
    // console.log(rowWords);
    if (rowWords.includes(rowWord) && selectedRowCounter[i] <= countAlts) {
      fill(255);
      ellipse(-10, 10, 30);
      selectedRow[i] += 1;
      selectedRowCounter[i] += 1;
      selectedRow[i] %= countAlts + 1;
      redraw();
      debug({
        countAlts,
        rows,
      });
      // console.log({ rowWord, i, rwl: rowWords.length, rows, }); // eslint-disable-line
    }
    rowWords.push(rowWord);
  }

  usedWords = rowWords.filter(w => w);
  unusedWords = words.filter(w => !rowWords.includes(w));
  drawButtons(x0, y0);
  noLoop();
}


// eslint-disable-next-line no-unused-vars
function mousePressed() {
}

// eslint-disable-next-line no-unused-vars
function mouseReleased() {
  redraw();
}

// eslint-disable-next-line no-unused-vars
function mouseDragged() {
  redraw();
}

class Word {
  constructor(verticalWord, iterator) {
    this.word = verticalWord;
    this.allWords = [];
    this.row = 0;
    this.col = 0;
    this.coords = [];
    this.coordsScore = [];
    this.scores = [];
    this.blockedCoords = [];
    this.iterator = iterator;
  }

  loadWords(wordsArr) {
    wordsArr.forEach((word) => {
      const max = cols - word.length;
      if (max <= cols) {
        for (let i = 0; i <= max; i += 1) {
          const left = '-'.repeat(i);
          const right = '-'.repeat(max - i);
          this.allWords.push(left + word + right);
        }
      }
    });
  }

  // r(word) {
  //   let r = '';
  //   for (let i = 0; i < word.length; i += 1) {
  //     r = word[i] + r;
  //   }
  //   return r;
  // }

  test() {
    const wordArr = Array.from(this.word || '');
    let row = 0;
    let col = 0;
    const i = this.iterator;
    col = i;
    row = 0;
    wordArr.forEach((char) => {
      const found = false;
      this.allWords.forEach((word) => {
        if (!found) {
          // const filtered = word.split('-').join('');
          if (word[col] === char) {
            this.scores[row] = this.scores[row] || [];
            this.scores[row].push({ word, char: col });
            this.wordToGrid(word, row);
            this.charToGrid(true, row, col);
          }
        }
      });
      row += 1;
    });

    let lowest = -1;
    // let lowIndex = -1;
    this.scores.forEach((scoreRow) => {
      if (lowest === -1) {
        lowest = scoreRow;
        // lowIndex = index;
      }
      if (lowest.length > scoreRow.length) {
        lowest = scoreRow;
        // lowIndex = index;
      }
    });
  }

  setCoord(row, col) {
    if (this.blockedCoords[row + (col * rows)]) {
      return false;
    }
    this.blockedCoords[row + (col * rows)] = true;
    return true;
  }

  // dir: true = left, false = down | Direction
  wordToGrid(word, row) {
    const len = word.length;
    for (let i = 0; i < len; i += 1) {
      this.coords[row + (i * rows)] = this.coords[row + (i * rows)] || [];
      this.coords[row + (i * rows)].push(word[i]);
    }
  }

  charToGrid(c, x, y) {
    this.coordsScore[x + (y * rows)] = c;
  }
}
