PShape s;

void setup() {
  size(980, 1280, P3D);
  // The file "bot.svg" must be in the data folder
  // of the current sketch to load successfully
  s = loadShape("nefertiti.obj");
}

void draw() {
  background(50);
  //material
  translate(width/2, height/2);
  float mouseVal = mouseX / 100.00;
  directionalLight(51, 102, 126, mouseX, mouseY, 30);
  scale(9);
  println("mouseVal", mouseX, mouseY);
  fill(255);
  noStroke();
  rotateY(sin(frameCount * 0.001) * PI * 10);
  sphere(10);
  fill(255);
  float t = 0;
  println(s, t);
  translate(0, t, 0);
  strokeWeight(2);
  shape(s, 0, 0);
}