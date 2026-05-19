class EQ {
  constructor(eq) {
    this.analyzer = eq;
    this.eq = [];
    this.avg = [];
    this.freqMax = 0;
    this.limit = 1000;
    this.freqs = [];
    this.history = [];
    this.historyMax = [];
    this.historPeaks = [];
    this.historyEq = [];
    this.bandsAmount = 0;
  }

  update() {
    this.eq = this.analyzer.analyze(32);
    this.bandsAmount = this.eq.length;
    this.avg = this.analyzer.linAverages();
    this.addHistory(this.eq);
  }

  addHistory() {
    this.historyEq.push(this.eq);
    const arrPeaks = [];
    this.eq.forEach((value, index) => {
      const maxVal = max(this.history[index]);
      arrPeaks[index] = this.isPeak(index) && value > maxVal ? value : maxVal;
      this.history[index] = this.history[index] || [];
      this.history[index].push(value);
      this.historyMax[index] = maxVal;
    });
    this.historPeaks.push(arrPeaks);
    const frameRateVal = floor(frameRate());
    // if (this.history[0].length / frameRateVal > 0.) {
      this.history.map(row => row.shift());
      this.historyEq.shift();
    // }

    if (this.historPeaks.length / frameRateVal > 10) {
      this.historPeaks.shift();
    }
  }

  getBands() {
    return this.bandsAmount;
  }

  getLevel(treshold, band) {
    var level = map(analyzer.getEnergy(band || 'treble'), 0, 255, 0, 1);
    var returnLevel = level > (treshold / 100) ? level : 0.001;
    return returnLevel;
  }

  getMax(index) {
    return map(this.historyMax[index], 0, 255, 0, 1);
  }
  isPeak(index) {
    const currVal = this.eq[index];
    if (currVal === 0) return false;
    if (index === 0) {
      if(currVal >= this.eq[index + 1]) {
        return true;
      }
    } else if (index === this.eq.length - 1) {
      if(currVal >= this.eq[index - 1]) {
        return true;
      }
    } else {
      if(currVal >= this.eq[index - 1]
        && currVal >= this.eq[index + 1]) {
        return true;
      }
    }
    return false;
  }

  getFrequencies() {
    if (this.historPeaks.length > 0) {
      return this.historPeaks.map(row => row.map(v => map(v, 0, 255, 0, random(0.97, 0.99))));
    }
    return [];
  }
}