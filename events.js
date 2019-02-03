const bindEvents = () => {
  stdin.on('keypress', this.onKeypress);
  stdin.on('data', this.onData);
  process.on('SIGINT', this.onInterrupt);
  process.on('exit', this.onExit);
  this.eventBinded = true;
}

const unbindEvents = () => {
  stdin.removeListener('keypress', this.onKeypress);
  stdin.removeListener('data', this.onData);
  process.removeListener('SIGINT', this.onInterrupt);
  process.removeListener('exit', this.onExit);
  this.eventBinded = false;
}

const onData = () => {
  readline.clearLine(stdout);
}

const onKeypress = (str, key) => {
  switch(key.name) {
    case 'up':
      this.move(-1);
      break;
    case 'down':
      this.move(1);
      break;
    case 'left':
      this.uncheck();
      break;
    case 'right':
      this.check();
      break;
    case 'space':
      this.checkToggle();
      break;
    case 'return':
      this.done();
      break;
    case 'escape':
      this.reject('User cancled'); 
      this.clear();
      this.unbindEvents();
      break;
    default:
      break;
  }
}

const onInterrupt = () => {
  this.reject('Interrupted');
  process.exit(1);
}

const onExit = () =>  {
  this.io.close();
  stdout.write(encode('[?25h'));
}


module.exports = {
  bindEvents,
  unbindEvents,
  onData,
  onKeypress,
  onInterrupt,
  onExit
};