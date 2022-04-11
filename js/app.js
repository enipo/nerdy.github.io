let canvas;
let s = function( p ) {
  let myFont;
  let docHeight;
  let canvasWidth;
  let canvasW;
  let canvasHeight;
  let canvasH;
  let vW;
  let vH;

  let debugField;
  let debugEnabled = false;
  let newText = {};

  let gutter;
  let size;
  let width;
  let height;
  let items;

  let header;
  let logoFirst;
  let logoRest;
  let body;
  
  let headers;
  let links;

  let animationType = 0;

  let scrollTop = 0;

  let isFocused = true;

  let maxFrameRate = 60;

  const depth = 2;
  const paddingX = .68;

  let mousePointLightCoords = {x: 0, y: 0};

  let lastScroll = new Date().getTime();

  let coords = [];

  p.handleDimensions = () => {
    docHeight = document.body.scrollHeight;
    canvasWidth = document.body.clientWidth;
    canvasW = canvasWidth / 2;
    canvasHeight = document.body.clientHeight;
    canvasH = canvasHeight / 2;
    vW = canvasWidth / 100;
    vH = canvasHeight / 100;
    gutter = 0;
    size = (vW + vH) * 3 + gutter;
    width = p.round(canvasWidth  / size);
    height = 4;
    items = width * height;
    coords = [];
    p.drawBlocks();
  }

  p.setup = () => {
    p.frameRate(maxFrameRate);
    p.init();

    header = new kip('header');
    logoFirst = new kip('header h1.logo');
    logoRest = new kip('header h1.logo span.otherChars');
    body = new kip('body');

    debugField = new kip('.debug');
    if (debugEnabled) {
      debugField.removeClass('hide');
    }
  };

  p.init = () => {
    p.handleDimensions();
    canvas = p.createCanvas(canvasWidth, canvasHeight, p.WEBGL);
    p.imageMode(p.CENTER);
    p.colorMode(p.HSB);
    p.angleMode(p.DEGREES);  
  }

  p.drawBlocks = () => {
    for (var i = 0; i < items; i++) {
      let x = ((i % width) * size);
      let y = ((p.floor(i / width) * size));
      let z = 80 * p.noise(y, x, p.random(1, 10));
      coords[i] = {x,y,z,oldZ:z,sat: 44, oldSat: 44};
    }
  };

  const frameRateHistory = [];
  p.handleFrameRate = () => {
    const currFrameRate = p.frameRate();
    frameRateHistory.push(currFrameRate);

    if (frameRateHistory.length > 220) {
      const avg = frameRateHistory.reduce((c, p) => c + p) / 120;
      frameRateHistory.shift();
      if (maxFrameRate > avg) {
        p.frameRate(avg - 3);
        console.log('changing FR', avg);
        console.log(frameRateHistory);
      }
    }
  };

  p.handleSlumber = () => {
    const frameRel = p.round(p.frameCount / p.frameRate());
    p.debug({
      frameCount: p.frameCount,
      frameRel,
    });
    if(frameRel < 2) return true;
    // Check every few frames if window has focus
    // If it has focus.. do nothing
    // If not, do one more loop to make stuff inactive
    // And return without rendering anything
    if (frameRel % 1 === 0) {
      if (!isFocused) {
        p.frameRate(5);
        isFocused = document.hasFocus();
        return false;
      } else {
        p.frameRate(maxFrameRate);
        isFocused = document.hasFocus();
      }
    } else if (!isFocused) {
      p.frameRate(2);
      return false;
    }
    return true;
  }

  p.handleActivity = () => {
    const currDate = new Date().getTime();
    if ((currDate - lastScroll) > 13000) {
      p.frameRate(15);
    } else {
      p.frameRate(maxFrameRate);
    }
  };

  p.draw = () => {
    if (p.frameCount === 1) {
      animationType = body.hasClass('page-post') ? 1 : 0;
      console.log(body, animationType, body.hasClass('page-post'));
      console.log('animationType', animationType);
      if (animationType === 1) {
        headers = new kip('.container header h2, figure.highlight');
        links = new kip('.container header h2, figure.highlight');
      } else {
        headers = new kip('.container .content article .article-date, .container .content article .more');
        links = new kip('.container .content article h2, .container .content article a, .container .content article span');
      }
    }
    p.handleActivity();
    // p.handleSlumber();

    p.background(0, 0, 0, 0);

    scrollTop = p.abs(document.querySelector('body').getBoundingClientRect().top);
    // p.frameRate(2);
    p.randomSeed(310);

    if(scrollTop >= 100 || animationType === 1) {
      const follow = headers.getClosest(p.mouseX - canvasW, p.mouseY - canvasH, scrollTop).slice(0, animationType === 1 ? 4 : p.min(3, scrollTop / 200));
      p.push();
      follow.forEach((el, index) => {
        p.push();
        const fX = (el.bound.left - canvasW);
        const fY = (el.bound.top - canvasH);
        p.translate(0, 0, 0);
        p.strokeWeight(2);
        const percentage = p.map(el.distNorm, 0, 1, 0, 0.5);
        const c = p.color(200 + index * 20,
                    percentage * 255,
                    percentage * 255,
                    percentage
                  );
        p.stroke(c);
        // p.stroke(200 + index * 20, 30 * el.distNorm, 155);
        sc.scribbleLine(-canvasW, -canvasH, fX, fY + (el.offsetHeight / 2));
        p.pop();
      });
      p.pop();

      p.push();
      p.translate(0, 0);
      p.debug({
        linkX: canvasW,
        linkY: docHeight - (docHeight - scrollTop),
      });

      const followLinks = links.getClosest(p.mouseX - canvasW, p.mouseY - canvasH, scrollTop).slice(0, animationType === 1 ? 3 : p.min(6, scrollTop / 200));
      const padding = 2;
      followLinks.forEach((el, index) => {
        p.push();
        const osWidth = el.offsetWidth + (padding);
        const osHeight = el.offsetHeight + (padding);
        const fX = (el.bound.left - canvasW) + (osWidth / 2) - (padding / 2);
        const fY = (el.bound.top - canvasH) + (osHeight / 2) - (padding / 2);
        p.strokeWeight(2);
        const percentage = p.map(el.distNorm, 0, 1, 0, 0.5);
        const c = p.color(20 + index * 20,
                    percentage * 255,
                    percentage * 255,
                    percentage
                  );
        p.stroke(c);
        sc.scribbleLine(fX + osWidth / 2, fY, canvasW, canvasH);
        // p.noStroke();
        // p.noFill();
        p.translate(fX, fY);
        // p.fill(200 + index * 20, 250 * (el.distNorm - 0.4), 155, 1);
        sc.scribbleRect(0, 0, osWidth, osHeight);
        p.pop();
      });
      p.pop();
    }

    if (animationType === 1) {
      // p.push();
      // p.ambientMaterial(150 + 23 * 9, 50, 115, 1);
      // p.translate(canvasW, -canvasH, -100);
      // p.box(100, 100, 100);
      // p.pop();
    }

    p.randomSeed();
    // p.ambientLight(230, 20, 75, 1); //isFocused ? 75 : 30
    // if (isFocused) {
    //   body.removeClass('lock');
    // } else {
    //   body.addClass('lock');
    // }
    if (animationType === 1) return;
    p.ambientLight(230, 20, 75, 1); //isFocused ? 75 : 30
    const pointLightZ = 800;
    const pointLightX = mousePointLightCoords.x || 0;
    const pointLightY = mousePointLightCoords.y || 100;//p.sin(p.frameCount * 1) * (canvasH);
    const v = p.createVector(pointLightX, pointLightY, pointLightZ);
    p.pointLight(200, 255, 255, 1, v); //isFocused ? 255 : 0

    if (debugEnabled) {
      p.push();
      p.fill(255);
      p.translate(pointLightX, pointLightY, 100);
      p.sphere(30);
      p.pop();
    }

  const speed = maxFrameRate / 30;
  const offsetX = -(width / 2 * size) + size / 2;
  const offsetY = -canvasHeight / 3.5;
  const offsetZ = 0;
  const distance = 150;
  const wave = p.abs(p.sin(p.frameCount * 0.12 * speed)) * canvasWidth;
  const inputX = p.winMouseY < 400 ? p.mouseX : wave;
  const inputY = p.winMouseY < 400 ? p.mouseY : canvasH / 2;
  if ((scrollTop + canvasHeight) > docHeight * .8) {

      const blockTop = scrollTop + canvasHeight;
      p.push();
      p.translate(0, docHeight);
      p.rotateX(3);
      p.rotateZ(-3);
      p.rotateY(-9);
      p.noStroke();
      for (let i = 0; i < 9; i++) {
        p.push();
        p.ambientMaterial(150 + 23 * i, 50, 115, 1);
        p.translate(-canvasW + (i * 14 * vW) - 50, -blockTop + (p.cos(p.frameCount * 0.1) * (i - 9 / 2.2) * 30) + canvasH * 1.3, -100);
        p.box(13 * vW, 60 * vH, 10 * vW);
        p.pop();
      }
      p.pop();
    }

    p.translate(offsetX, offsetY, 400);

    if (scrollTop > 135) {
      logoFirst.addClass('slide');
    } else {
      logoFirst.removeClass('slide');
    }

    if (scrollTop > 160) {
      logoFirst.addClass('stop');
      header.addClass('slide');
    } else {
      header.removeClass('slide');
      logoFirst.removeClass('stop');
    }

    if (scrollTop < p.min(canvasH * 0.4, 450)) {
      const degree = p.map(scrollTop / p.abs(offsetY), 0, 1, -55, -160);
      const color = p.map(scrollTop / p.abs(offsetY), 0, 1, 0, -0.7);
      const relief = p.map(scrollTop / p.abs(offsetY), 0, 1, 1, -5);
      p.rotateX(degree);
      for (var i = 0; i < items - 4; i++) {
        p.push();
        p.noStroke();
        let x = coords[i].x;
        let y = coords[i].y;
        let z = coords[i].z;
        let sat = coords[i].sat;

        let d = 1;
        d = p.dist(inputX - (size * 2), inputY, x, y);
        if (d < distance) {
          z = p.min(140, z + p.noise(x, y) * p.map(d, 0, distance, 2 * speed, 1 * speed));
          coords[i].z = z;
          sat = sat + p.map(d, 0, distance, 1.3 * speed, 0.2 * speed);
          coords[i].sat = sat;
        } else if (coords[i].z !== coords[i].oldZ) {
          coords[i].z = p.max(coords[i].oldZ, coords[i].z - (0.5 * speed));
          z = coords[i].z;
          coords[i].sat = p.max(coords[i].oldSat, coords[i].sat - (0.5 * speed));
          sat = coords[i].sat;
        }

        p.ambientMaterial(p.map(p.noise(x, y, p.sin(y)) - color, 0, 1, 100, 390), sat * 1.8, 115, 1);
        const dC = p.dist(canvasW, 0, x, y) * -p.sin(p.frameCount * .1) / 100;
        p.translate(x + (dC * 10), y + (dC * 10), relief * (z - offsetZ));
        p.box((size - gutter), (size - gutter), (size * depth));
        p.pop();
      }
      p.debug({
        stopped: false,
      });
    } else {
      p.debug({
        stopped: true,
      });
    }
    
    p.debug({
      scrollTop,
      mouseX: p.mouseX,
      mouseY: p.mouseY,
      mouseCX: p.mouseX - canvasW,
      mouseCY: p.mouseY - canvasH,
      canvasWidth,
      canvasW,
      canvasHeight,
      canvasH,
      vW,
      vH,
    });
  };

  p.windowResized = () => {
    p.handleDimensions();
    p.resizeCanvas(canvasWidth, canvasHeight);
  }

  p.debug = (text, title = '') => {
    if (!debugEnabled) return;
    if (title) {
      newText[title] += `<h3>${title}</h3>`;
    }
    newText.frameRate = `<span>frameRate</span>:
                  ${p.frameRate().toFixed(0)}<br />`;
    
    Object.keys(text || {}).forEach(function(key) {
      newText[key] = `<span>${key}</span>: 
        ${String(text[key]).split(',').join('<br />')}<br />`;
    });
    debugField.html(Object.values(newText).join(''));
  }

  p.mousePressed = () => {
    mousePointLightCoords.x = p.mouseX - canvasW;
    mousePointLightCoords.y = p.mouseY - canvasH;
  }

  p.mouseDragged = () => {
    mousePointLightCoords.x = p.mouseX - canvasW;
    mousePointLightCoords.y = p.mouseY - canvasH;
  }

  p.mouseWheel = () => {
    lastScroll = new Date().getTime();
  };

  p.keyPressed = () => {
    console.log('PRESSING KEY!', p.keyCode);
    switch(p.keyCode) {
      case 68:
        debugEnabled = !debugEnabled;
        if (debugEnabled === true) {
          debugField.removeClass('hide');
        } else {
          debugField.addClass('hide');
        }
        break;
    }
    // return false; // prevent default
  }
};
