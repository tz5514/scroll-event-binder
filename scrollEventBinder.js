class ScrollEventBinder {
  target = window;
  range = [0, 'max'];
  bottomBound = null;
  callback = () => {};
  shouldCallback = () => true;
  duringCallback = false;

  constructor(options) {
    Object.assign(this, options);
    this.target = (this.target == window || this.target == document || this.target == document.body) ? window : this.target;

    let [minimum, maximum] = this.range;
    this.minimum = (minimum >= 0)? minimum : 0;
    this.maximum = maximum;
    if (maximum != 'max' && maximum < minimum) {
      console.error("The setting maximum value can't be less than minimum value.");
      return;
    }

    this.bind();
  }

  bind() {
    this.target.addEventListener('scroll', this.event);
  }

  unbind() {
    this.target.removeEventListener('scroll', this.event);
  }

  getScrollTop() {
    if (this.target == window) {
      return window.scrollY;
    } else {
      return this.target.scrollTop;
    }
  }

  isBottom() {
    if (this.target == window) {
      return document.body.scrollHeight - window.innerHeight - window.scrollY <= this.bottomBound;
    } else  {
      return this.target.scrollHeight - this.target.scrollTop - this.target.offsetHeight  <= this.bottomBound;
    }
  }

  isBetweenRange() {
    const scrollTop = this.getScrollTop();
    console.log(scrollTop);
    return (this.maximum == 'max' && scrollTop >= this.minimum) || (scrollTop >= this.minimum && scrollTop <= this.maximum);
  }

  runCallback() {
    const scrollTop = this.getScrollTop();
    if (this.shouldCallback() && !this.duringCallback) {
      this.duringCallback = true;
      this.callback(scrollTop);
      this.duringCallback = false;
    }
  }

  event = () => {
    if (this.bottomBound) {
      if (this.isBottom()) {
        this.runCallback();
      }
    } else {
      if (this.isBetweenRange()) {
        this.runCallback();
      }
    }
  }
}

export function createScrollEvent(options) {
  return new ScrollEventBinder(options);
}
