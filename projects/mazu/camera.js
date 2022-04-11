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
    this.scheduleState = [];
    this.progress = 0;
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
    debug({
      cameraX: Number(this.x).toFixed(5),
      cameraY: Number(this.y).toFixed(5),
      cameraZ: Number(this.z).toFixed(5),
      cameraCenterX: Number(this.centerX).toFixed(5),
      cameraCenterY: Number(this.centerY).toFixed(5),
      cameraCenterZ: Number(this.centerZ).toFixed(5),
      cameraUpX: Number(this.upX).toFixed(5),
      cameraUpY: Number(this.upY).toFixed(5),
      cameraUpZ: Number(this.upZ).toFixed(5),
      cameraRotateX: Number(this.rotateX).toFixed(5),
      cameraRotateY: Number(this.rotateY).toFixed(5),
      cameraRotateZ: Number(this.rotateZ).toFixed(5),
      cameraZoom: Number(this.scale).toFixed(5),
      cameraUpdating: this.changedCamera,
      });
  }

  update(progress) {
    rotateX(this.rotateX);
    rotateY(this.rotateY);
    rotateZ(this.rotateZ);
    // if (this.changedCamera) {
      // console.log(this.x, this.y, this.z, this.centerX, this.centerY, this.centerZ, this.upX, this.upY, this.upZ);
    camera(this.x, this.y, this.z, this.centerX, this.centerY, this.centerZ, this.upX, this.upY, this.upZ);
    // }
    // if (this.changedScale) {
    scale(this.scale);
    // }
    this.reset();
    this.progress = progress;
  }

  // What, when, how long, target value
  // Example: pivot, 15, 2, 100
  schedule(what, when, howlong, targetValue) {

    if (!(this.progress > when && this.progress < (when + howlong))) {
      return;
    }

    let currValue = 0;
    switch (what) {
      case 'zoom':
        currValue = this.scale;
        break;
      case 'pan':
        currValue = this.rotateX;
        break;
      case 'tilt':
        currValue = this.rotateY;
        break;
      case 'pivot':
        currValue = this.rotateZ;
        break;
      case 'x':
        currValue = this.x;
        break;
      case 'y':
        currValue = this.y;
        break;
      case 'z':
        currValue = this.z;
        break;
    }

    let steps = ((targetValue - currValue) / howlong);

    steps = steps / frameRate();
    const t1 = when;
    const t2 = when + (howlong * .25);
    const t3 = when + (howlong * .75);
    let factor = 1;

    if (this.progress > t3) {
      factor = steps * .5;
    } else if (this.progress > t2) {
      factor = steps * 2;
    } else if (this.progress > t1) {
      factor = steps * .5;
    } 

    switch (what) {
      case 'zoom':
        this.zoom(factor);
        break;
      case 'pan':
        this.pan(factor);
        break;
      case 'tilt':
        this.tilt(factor);
        break;
      case 'pivot':
        this.pivot(factor);
        break;
      case 'x':
        this.setX(factor);
        break;
      case 'y':
        this.setY(factor);
        break;
      case 'z':
        this.setZ(factor);
        break;
    }

    // debug({
    //   schedule
    // })
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
      px = this.y + px;
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