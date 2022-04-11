var path = [];

var resolution = 0.7;
var rotationX = 0.01;
var rotationSpeedZ = 0.001;
var rotationY = 0.0
var cameraSpeed = 0.01;

var prevR, prevG, prevB;
var sun;
var end;

var circled = 0

function setupSketch() {
  if (!useMic) {
    song.play();
  }
  createCanvas(canvasWidth, canvasHeight, WEBGL);
  startPoint(2, 0);
  colorMode(HSB);
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
  var progressFloat = ((mouseCX / 10) || millis() / 1000) / 5;
  var levelSoft = getLevel(30, 'treble');
  var levelNormal = getLevel(45, 'treble');
  var levelLoud = getLevel(60, 'treble');
  if(getLevel(10) < 0.001 && (progressFloat > 2 && progressFloat < 10)) {
    return;
  }
  if (progressFloat < 10) {
    cameraSpeed += cameraSpeed / (timeLength * 0.0005);
    if (cameraSpeed > 6000) {
      cameraSpeed = 6000;
    }
  } else if (progressFloat < 30 && cameraSpeed !== 2500) {
    if (cameraSpeed < 2540 && cameraSpeed > 2460) {
      cameraSpeed = 2500;
    } else if(cameraSpeed > 2500) {
      cameraSpeed -= cameraSpeed / (timeLength * 0.00003);
    } else {
      cameraSpeed += cameraSpeed / (timeLength * 0.00003);
    }
  } else if (progressFloat > 78 && cameraSpeed > 10) {
    cameraSpeed -= cameraSpeed / (progressFloat * 0.000024);
  }
  // cameraSpeed = max(-6000, min(6000, cameraSpeed));
  // camera(canvasWidth / 2, 0, cameraSpeed, 0, 0, 0, 0, 10, 0);
  
  // texture(image1)
  // plane(500, 500);
  // translate(500, 50);

  if (progressFloat >= 4) {
    if(progressFloat <= 30 || progressFloat >= 70) {
      rotationSpeedZ += levelNormal * 0.1;
    }
    if (rotationSpeedZ > 0) {
      rotationSpeedZ -= 0.001;
    } else {
      rotationSpeedZ += 0.001;
    }
    rotationX += 0.001;

    if ((progressFloat >= 4 && progressFloat <= 39) || progressFloat >= 50) {
      rotateZ(rotationX * rotationSpeedZ * (rotationSpeedZ > 5 ? -.1 : .1) * PI/4);
    }
    if (progressFloat >= 6) {
      rotateX(rotationX * rotationSpeedZ * (rotationSpeedZ > 2 ? -.1 : .1) * PI/2);
    }
    if (progressFloat >= 19) {
      rotateY(levelSoft * PI / 2);
    }
  }
  debug({
    progressFloat: Number(progressFloat).toFixed(5),
    rotationX: Number(rotationX).toFixed(5),
    rotationY: Number(rotationY).toFixed(5),
    rotationZ: Number(rotationZ).toFixed(5),
    rotationSpeedZ: Number(rotationSpeedZ).toFixed(5),
    cameraSpeed: Number(cameraSpeed).toFixed(5),
    levelSoft: Number(levelSoft).toFixed(5),
    levelNormal: Number(levelNormal).toFixed(5),
    levelLoud: Number(levelLoud).toFixed(5),
  });

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
      var color = random(40, 255 * levelSoft * 0.5);
      if(progressFloat <= 30) {
        color *= 4;
      } else if(progressFloat <= 60) {
        color *= 1.3;
      } else {
        color = random(155, 200);
      }
      
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
  if(progressFloat >= 15 && progressFloat <= 20 || progressFloat > 25 && progressFloat < 30) {
    fill(random(255 * getLevel(30), 255 * getLevel(30) * 2), 255, 255, 1);
  } else {
    noFill();
  }
  
  for (var pos of path) {
    var level = getLevel(40);
    if(progressFloat > 20 && progressFloat < 62 || progressFloat > 80 && progressFloat < 92) {
      stroke(random(40, 255 * getLevel(30) * 0.5), 255, 255, 1);
      strokeWeight(2);
      vertex(pos.vector.x, pos.vector.y, pos.vector.z);
    } else if(progressFloat >= 20) {
      stroke(pos.color, 255, 255, 1);
      strokeWeight(2);
      vertex(pos.vector.x, pos.vector.y, pos.vector.z);
    } else {
      stroke(pos.color, 255, 255, 1);
      if (progressFloat > 7) {
        strokeWeight(Math.min(getLevel(40) * 4, 4));
      }
      vertex(pos.vector.x / 5, pos.vector.y / 5);
    }
  }
  endShape();
}