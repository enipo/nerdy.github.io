// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Fractal Spirograph
// Video: https://youtu.be/0dwJ-bkJwDI

var k = -4;
var shifted = false;

function Orbit(x_, y_, z_, r_, n, p) {
  this.x = x_;
  this.y = y_;
  this.z = z_;
  this.r = r_;
  this.parent = p;
  this.child = null;
  this.speed = (radians(pow(k, n-1)))/resolution;
  this.angle = -PI/2;

  this.addChild = function() {
    var newr = this.r / (Math.max(2, (Math.random() * 6) / 2));
    var newx = this.x + this.r + newr;
    var newz = this.z + this.r - newr;
    var newy = this.y;
    this.child = new Orbit(newx, newy, newz, newr, n+1, this);
    return this.child;
  }

  this.update = function(level) {
    var mainLevel = 0;
    // if(Math.round(level * 100) % 2 == 0) {
    //   mainLevel += level;
    // } else {
    //   mainLevel -= level;
    // }
    var parent = this.parent;
    if (parent != null) {
      this.angle += this.speed;
      var rsum = this.r + parent.r / (1+mainLevel);
      this.x = parent.x + rsum * cos(this.angle);
      this.y = parent.y + rsum * sin(this.angle);
      this.z = parent.z + rsum * sin(this.angle) * cos(this.angle);
      if (this.r > 50) {
        var round = Math.round(this.x / 72) / 10;
        var modulo = Math.round(this.x / 72) / 10 % 2;
        // console.log(round, modulo);
        // if (round === 1 && modulo === 1 && shifted === false) {
        //   shifted = true;
        //   console.log(round, modulo, shifted);
        //   this.angle += -PI/2;
        //   debugger;
        // } else {
        //   console.log(round, modulo, shifted);
        //   shifted = false;
        // }
        // console.log(this.angle, rsum, this.x, this.y);
      }
    }
  }

  this.show = function() {
    stroke(255, 100);
    strokeWeight(4);
    // noFill();
    ellipse(this.x, this.y, this.r*2, this.r*2);
  }
}