class kip {
  constructor(selector) {
    this.selector = this.selector || document.querySelectorAll(selector);
    this.docHeight = document.body.scrollHeight;
    this.canvasWidth = document.body.clientWidth;
    this.canvasW = this.canvasWidth / 2;
    this.canvasHeight = document.body.clientHeight;
    this.canvasH = this.canvasHeight / 2;
    this.debugEnabled = false;

    this.prevEl = [];
  }

  hasClass(name) {
    return this.handleType(this.selector[0], name, 'has');
  }

  addClass(name) {
    return this.handle(name, 'add');
  }

  removeClass(name) {
    return this.handle(name, 'remove');
  }

  getClosest(x, y, scrollY) {
    let closest = 100000000;
    x = x + this.canvasW;
    y = y + this.canvasH + scrollY;
    this.drawSquare(x, y, 'CENTER');
    const keys = Array.from(this.selector);
    const items = keys.map((e, index) => {
      const el = e.getBoundingClientRect();
      const d = p.dist(x, y, el.left + (el.width / 2), scrollY + el.top + (el.height / 2));
      this.drawSquare(el.left, scrollY + el.top, 'DOT-' + index, d);
      e.bound = el;
      e.dist = Number(d);
      closest = p.min(closest, d);
      return e;
    }).map(c => c = Object.assign(c, {distNorm: Number(closest / c.dist)}));
    return items.sort((a, b) => a.dist > b.dist ? 1 : -1);
  }

  drawSquare(x, y, id, text = "") {
    if (!this.debugEnabled) return;
    const div = document.createElement('div');
    div.style.cssText = `top: ${y}; left: ${x};`;
    div.innerText = `${id} ${y}, ${x} [${text}]`;
    div.className += ' pixel';
    div.id = id;
    if (this.prevEl[id]) {
      this.prevEl[id].remove();
    }
    document.body.appendChild(div);
    this.prevEl[id] = div;
  }

  handle(name, type) {
    Object.keys(this.selector).forEach(e => this.handleType(this.selector[e], name, type));
  }

  handleType(el, className, type) {
    if (!el) {
      return false;
    }

    const l = el.classList;
    let result = false;
    switch (type) {
      case 'add':
        if (!this.handleType(el, className, 'has')) {
          if (l) {
            el.classList.add(className);
            result = this.selector;
          } else {
            el.className += ' ' + className;
            result = this.selector;
          }
        }
        break;
      case 'remove':
      if (this.handleType(el, className, 'has')) {
          if (l) {
            el.classList.remove(className);
            result = this.selector;
          } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            result = this.selector;
          }
        }
      break;
      case 'has':
        if (l) {
          result = el.classList.contains(className);
        } else {
          result = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
        break;
    }
    return result;
  }
  
  html(text) {
    Object.keys(this.selector).forEach(e => this.selector[e].innerHTML = text);
  }
}