class viewController {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.centerZ = 0;
    this.upX = 0;
    this.upY = 0;
    this.upZ = 10;
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.reset();
  }

  reset() {
    this.changedCamera = false;
    this.changedScale = false;
    this.changedRotateX = false;
    this.changedRotateY = false;
    this.changedRotateZ = false;
  }

  keys(keycode) {
    // switch (keycode) {
    //   case 65:
    //     this.zoom(1)
    //     break;
    //   case 65:
    //     break;
    //   case 65:
    //     break;
    //   case 65:
    //     break;
    //   case 65:
    //     break;
    //   case 65:
    //     break;
    //   case 65:
    //     break;
    //   case 65:
    //     break;
    //   case 65:
    //     break;
    // }
    return true;
  }

  interactive() {
    // if (keyCode === SHIFT) {
    //   console.log(keyCode);
    //   this.zoom(map(mouseX, 0, canvasWidth, -5000, 5000), true);
    //   this.setX(map(mouseY, 0, canvasHeight, -5000, 5000), true);
    // } else if (keyCode === CONTROL) {
    //   this.pan(map(mouseX, 0, canvasWidth, -500, 500), true);
    //   this.tilt(map(mouseY, 0, canvasHeight, -500, 500), true);
    // } else if (keyCode === OPTION) {
    //   this.pivot(map(mouseX, 0, canvasWidth, -5000, 5000), true);
    //   this.setY(map(mouseY, 0, canvasHeight, -5000, 5000), true);
    // } else if (keyCode === ESCAPE) {
      
    // }
  }

  debugInfo() {
    return `
      <h3>debug info: View</h3>
      <span>x</span>: ${Number(this.x).toFixed(5)}<br />
      <span>y</span>: ${Number(this.y).toFixed(5)}<br />
      <span>z</span>: ${Number(this.z).toFixed(5)}<br />
      <span>centerX</span>: ${Number(this.centerX).toFixed(5)}<br />
      <span>centerY</span>: ${Number(this.centerY).toFixed(5)}<br />
      <span>centerZ</span>: ${Number(this.centerZ).toFixed(5)}<br />
      <span>upX</span>: ${Number(this.upX).toFixed(5)}<br />
      <span>upY</span>: ${Number(this.upY).toFixed(5)}<br />
      <span>upZ</span>: ${Number(this.upZ).toFixed(5)}<br />
      <span>rotateX</span>: ${Number(this.rotateX).toFixed(5)}<br />
      <span>rotateY</span>: ${Number(this.rotateY).toFixed(5)}<br />
      <span>rotateZ</span>: ${Number(this.rotateZ).toFixed(5)}<br />
      <span>zoom</span>: ${Number(this.scale).toFixed(5)}<br />
      <span>updating</span>: ${this.changedCamera}<br />
    `;
  }

  update() {
    rotateX(this.rotateX);
    rotateY(this.rotateY);
    rotateZ(this.rotateZ);
    if (this.changedCamera) {
      // console.log(this.x, this.y, this.z, this.centerX, this.centerY, this.centerZ, this.upX, this.upY, this.upZ);
      camera(this.x, this.y, this.z, this.centerX, this.centerY, this.centerZ, this.upX, this.upY, this.upZ);
    }
    if (this.changedScale) {
      scale(this.scale);
    }
    this.reset();
  }

  set(scale, x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.scale = scale;
    this.changedCamera = true;
    this.changedScale = true;
  }

  setY(px, override = false) {
    const old = this.y;
    if (!override) {
      py = this.y + px;
    }
    this.y = max(-5000, min(5000, px)); 
    if (old !== this.y) {
      this.changedCamera = true;
    }
  }

  setX(px, override = false) {
    const old = this.x;
    if (!override) {
      px = this.x + px;
    }
    this.x = max(-5000, min(5000, px)); 
    if (old !== this.x) {
      this.changedCamera = true;
    }
  }

  setZ(px, override = false) {
    const old = this.z;
    if (!override) {
      px = this.z + px;
    }
    this.z = max(-8000, min(8000, px));
    if (old !== this.z) {
      this.changedCamera = true;
    }
  }

  zoom(px, override = false) {
    const old = this.scale;
    if (!override) {
      px = max(-12, min(12, this.scale + px));
    }
    this.scale = px;
    if (old !== this.scale) {
      this.changedScale = true;
    }
  }

  pan(px, override = false) {
    const old = this.rotateX;
    if (!override) {
      px = this.rotateX + px;
    }
    this.rotateX = max(-4000, min(4000, px));
    if (old !== this.rotateX) {
      this.changedRotateX = true;
    }
  }

  tilt(px, override = false) {
    const old = this.rotateY;
    if (!override) {
      px = this.rotateY + px;
    }
    this.rotateY = max(-4000, min(4000, px));
    if (old !== this.rotateY) {
      this.changedRotateY = true;
    }
  }

  pivot(px, override = false) {
    const old = this.rotateZ
    if (!override) {
      px = this.rotateZ + px;
    }
    this.rotateZ = max(-4000, min(4000, px));
    if (old !== this.rotateZ) {
      this.changedRotateZ = true;
    }
  }
}