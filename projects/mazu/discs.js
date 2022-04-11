class Disc {
  constructor() {
    this.amountOfDots = 1000;
    this.loopCounter = 0;
    this.c = 30;
    this.diameter = 8;
    this.showDisc1 = true;
    this.showDisc2 = true;
    colorMode(HSB);
  }
  
  setZoom(scale) {
    this.scale = scale;
  }
  setAngle(angle) {
    this.angle = angle;
  }
  setBaseColor(color) {
    this.baseColor = color;
  }
  setLevels(low, mid, high) {
    this.levelLow = low;
    this.levelMid = mid;
    this.levelHigh = high;
  }

  setShowDisc(disc1, disc2) {
    // this.showDisc1 = !!disc1;
    // this.showDisc2 = !!disc2;
  }

  debugInfo() {
    return `
      <h3>debug info: Discs</h3>
      <span>levelLow</span>: ${(this.levelLow).toFixed(5)}<br />
      <span>levelMid</span>: ${(this.levelMid).toFixed(5)}<br />
      <span>levelHigh</span>: ${(this.levelHigh).toFixed(5)}<br />
      <span>baseColor</span>: ${(this.baseColor).toFixed(5)}<br />
      <h3>randomShit</h3>: ${this.randomShit}<br />
    `;
  }

  show () {
    let prevZ;
    const ratio = max(0.01, min(11, max(0.01, this.scale)) / 12);
    const speedUp = 1;
    const angleRounded = abs(this.angle - round(this.angle));

    for (let i = 0; i < this.amountOfDots; i++) {
      this.loopCounter++;
      const a = i * this.angle;
      const r = this.c * (i / PI);
      const r2 = this.c * sqrt(i);
      const x = r * cos(a);
      const y = r * sin(a);
      const x2 = r2 * cos(a);
      const y2 = r2 * sin(a);

      if (this.amountOfDots * (1.5 - ratio) > i && this.showDisc2) {
        push();
        strokeWeight(0);
        translate(x, y,
          noise(i / 4, prevZ || i / 4));
        prevZ = (i / 4);
        fill((i % this.baseColor), 90, (this.amountOfDots / 255) * (this.amountOfDots / i))
        sphere((this.diameter / 2) * (1.7 - ratio)); // * this.levelLow
        pop();
      }
      // * ratio * map(this.levelLow, 0.1, 0.8, 1, 4 * (1 - ratio))
      
      if (this.amountOfDots * (1 - ratio) > i && this.showDisc1) {
        push();
        strokeWeight(0);
        noStroke();
        const discDriver = sin(this.loopCounter * 0.00001);
        translate(y2 * speedUp * (2 - ratio), x2 * speedUp * (2 - ratio), (i * -discDriver) - (discDriver * 1000) * (2 - ratio));
        const color = Number((256 - i % floor(this.baseColor || 1)));
        const saturation = 255 * angleRounded;
        const opacity = (255 - (this.amountOfDots / 255) * (this.amountOfDots / i))  * (0.1 + ratio);
        fill( color, 120, 120, opacity);
        sphere((this.diameter / 3) * (2 - ratio)); // , 20 * (this.levelHigh * ratio)
        pop();
      }
      // debug({
      //   discColor: Number(color).toFixed(1),
      //   discSaturation: Number(saturation).toFixed(1),
      // });
    }
    debug({
      ratio: Number(ratio).toFixed(5),
      loopCounter: this.loopCounter,
    });
  }
}