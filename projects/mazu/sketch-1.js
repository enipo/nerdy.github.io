var path = [];

var resolution = 0.3;
var rotationX = 0.01;
var rotationSpeedZ = 0.001;
var rotationY = 0.0
var cameraSpeed = 0.01;

var prevR, prevG, prevB;
var sun;
var end;

var progressFloat = 0;

var circled = 0

function setupSketch() {
  if (!useMic) {
    song.play();
    // song.setVolume(0);
  }
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  startPoint(2, 0);
  colorMode(HSB);

  viewObj = new viewController();
  // disc = new Disc();
  directionalLight(255, 255, 255, 0, -1, 0);
  ambientLight(255, 255, 255);
}

function startPoint(planets, offset) {
  sun = new Orbit(0, 0, 0, width/8 + offset, 0);
  var next = sun;
  for (var i = 0; i < planets; i++) {
    next = next.addChild();
  }
  end = next;
}

function draw() {
  defaultDraw();
  if (frameCount === 1) {
    viewObj.set(1, -10, 0, 400);
  }
  progressFloat = millis() / 5000;
  if (winMouseCX) {
    progressFloat = winMouseCX / 20;
    winMouseCX = 0;
  }
  if (progressFloat > 100) {
    progressFloat = 0;
  }
  var levelSoft = getLevel(3, 'treble');
  var levelNormal = getLevel(45, 'treble');
  var levelLoud = getLevel(60, 'treble');
  if(getLevel(10) < 0.001 && (progressFloat > 2 && progressFloat < 10)) {
    return;
  }

  // if (progressFloat >= 4) {
  //   if ((progressFloat >= 26 && progressFloat <= 49) || progressFloat >= 90) {
  //     viewObj.pivot(rotationX * rotationSpeedZ * (rotationSpeedZ > 5 ? -.1 : .1) * PI/4);
  //   }
  //   if (progressFloat >= 26) {
  //     viewObj.pan(rotationX * rotationSpeedZ * (rotationSpeedZ > 2 ? -.1 : .1) * PI/2);
  //     // rotateX();
  //   }
  //   if (progressFloat >= 90) {
  //     rotateY(levelSoft * PI / 2);
  //   }
  // }

  viewObj.schedule('zoom', 4, 4, 0.3);
  // viewObj.schedule('pan', 0.1, 0.1, 180);
  // viewObj.schedule('pan', 1, 0.5, 0);
  // viewObj.schedule('tilt', 1.5, 10, 10);
  // viewObj.schedule('zoom', 6, 4, 0.6);
  // viewObj.schedule('tilt', 1.5, 10, 10);
  // viewObj.schedule('zoom', 9, 2, 0.3);
  // viewObj.schedule('zoom', 9.5, 0.5, 100);
  // viewObj.schedule('tilt', 9.5, 0.5, 0);
  // viewObj.schedule('pan', 9.5, 0.5, 0);
  viewObj.schedule('x', 3, 5, 400);
  viewObj.schedule('y', 5, 5, -400);
  viewObj.schedule('z', 7, 5, 1400);
  // viewObj.schedule('zoom', 10.1, 0.2, 1);
  
  // viewObj.schedule('pivot', 14, 4, 100);
  // viewObj.schedule('pivot', 14.9, 0.1, 0);
  // viewObj.schedule('zoom', 14.5, 0.5, 0.05);

  // viewObj.schedule('zoom', 14.5, 0.5, 0.05);
  // viewObj.schedule('pan', 19, 30, 10);
  // viewObj.schedule('tilt', 21, 40, 180);

  // viewObj.schedule('zoom', 15.2, 20, 0.8);

  // viewObj.schedule('zoom', 1, 4, 0.6);
  // viewObj.schedule('zoom', 1, 4, 0.6);
  // viewObj.schedule('zoom', 1, 4, 0.6);
  // viewObj.interactive();
  viewObj.update(this.progressFloat);

  debug({
    progressFloat: Number(progressFloat).toFixed(5),
    levelSoft: Number(levelSoft).toFixed(5),
    levelNormal: Number(levelNormal).toFixed(5),
    levelLoud: Number(levelLoud).toFixed(5),
  });
  viewObj.debugInfo();

  fill(200,200,200, 50);
  translate(0, 10, 10);
  if(progressFloat < 15 || progressFloat > 20) {
    background(0);
  }

  if(progressFloat < 30) {
    for (var i = 0; i < resolution; i++) {
      var next = sun;
      while (next != null) {
        next.update(levelLoud);
        next = next.child;
      }
      var color = map(noise(round(progressFloat), levelLoud), 0, 1, 340, 280);
      // if(progressFloat <= 30) {
      //   color *= 4;
      // } else if(progressFloat <= 60) {
      //   color *= 1.3;
      // } else {
      //   color = random(155, 200);
      // }
      
      path.push({vector: createVector(end.x, end.y, end.z), color: color});
    }
  }

  var next = sun.child;
  // while (next != null) {
  //   // next.show();
  //   next = next.child;
  // }
  // console.log(next.angle);
  if (next.angle > (PI * 1.5)) {
    circled++;
    startPoint(Math.ceil(getLevel(10) * 5), circled * random(-100, 100));
  }

  // push();
  // translate(-100, 100, 10);
  // texture(img);
  // box(1450, 500);
  // pinLight(255,0,0); //even red light across our objects
  // pop();

  // fill(255, 0, 255);
  beginShape();
  // || progressFloat > 25 && progressFloat < 30
  if(progressFloat >= 15 && progressFloat <= 16) {
    fill(map(noise(round(progressFloat), getLevel(30) * 360, getLevel(30) * 90), 0, 1, 250, 300), 255, 255, 0.6);
  } else {
    noFill();
  }
  
  for (var pos of path) {
    var level = getLevel(40);
    if(progressFloat > 40 && progressFloat < 10 || progressFloat > 80 && progressFloat < 92) {
      stroke(360 * noise(round(progressFloat), getLevel(30)), 255, 255, .31);
      strokeWeight(2);
      vertex(pos.vector.x, pos.vector.y, pos.vector.z);
    } else if(progressFloat >= 20) {
      stroke(pos.color, 255, 255, .41);
      strokeWeight(2);
      vertex(pos.vector.x, pos.vector.y, pos.vector.z);
    } else {
      stroke(pos.color, 255, 255, 1);
      const strokeWidth = 
        progressFloat > 7 ? noise(round(progressFloat), getLevel(40)) * 3
                          : noise(round(progressFloat), getLevel(40) * 1.5);
      strokeWeight(strokeWidth);
      vertex(pos.vector.x / 5, pos.vector.y / 5);
    }
  }
  endShape();
}