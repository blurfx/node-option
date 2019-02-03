const clear = (isReturnKeyPressed) => {
  readline.cursorTo(stdout, 0);
  readline.moveCursor(stdout, 0, -this.options.length - (isReturnKeyPressed ? 1 : 0));
  readline.clearScreenDown(stdout);
};

const refresh = () => {
  this.clear();
  this.render();
}

const move = (relPos) => {
  this.cursor += relPos;
  if(this.cursor >= this.options.length) this.cursor = this.options.length - 1
  if(this.cursor < 0) this.cursor = 0;
  this.refresh();
}

const uncheck = () => {
  if(this.options[this.cursor] !== undefined) {
    this.options[this.cursor].checked = false;
  }
  stdout.write(encode('[?25h'));
  this.refresh();
}

const check = () => {
  if(this.options[this.cursor] !== undefined) {
    this.options[this.cursor].checked = true;
  }
  this.refresh();
}

const checkToggle = () => {
  if(this.options[this.cursor] !== undefined) {
    this.options[this.cursor].checked = !this.options[this.cursor].checked;
  }
  this.refresh();
}

const done = () => {
  this.clear(true);
  this.unbindEvents();
  stdout.write(encode('[?25h'));
  this.io.close();
  this.resolve(
    this.options.filter(o => o.checked === true).map(o => o.value)
  );
}

module.exports = {
  clear,
  refresh,
  move,
  check,
  uncheck,
  checkToggle,
  done,
}