const readline = require('readline');
const chalk = require('chalk');

const stdin = process.stdin;
const stdout = process.stdout;

const _encode = (str) => Buffer.from([0x1b].concat(str.split('').map(c => c.charCodeAt(0))));

class Selector {
  
  constructor(config) {
    this._config = Object.assign({
      cursor: '>',
      checkedMark: '✓',
      uncheckedMark: ' ',
      markWrapperLeft: '[',
      markWrapperRight: ']',
      cursorColor: 'cyan',
      checkedMarkColor: 'green',
      uncheckedMarkColor: 'black',
      markWrapperColor: 'white',
      textColor: 'yellow',
      multiselect: true,
      highlight: true,
    }, config);

    const colorKeys = [
      this._config.cursorColor,
      this._config.checkedMarkColor,
      this._config.uncheckedMarkColor,
      this._config.markWrapperColor,
      this._config.textColor,
    ];

    colorKeys.forEach(key => {
      if(typeof(chalk[key]) !== 'function' || typeof chalk[key]['hasGrey'] !== 'boolean') {
        throw `${key} is not supported color.`;
      }
    })

    this._options = [];
    this._selectedCount = 0;
    this._cursor = 0;
    this._initialized = false;
    this._promise = undefined;
    this._resolve = undefined;
    this._reject = undefined;
    this._io = readline.createInterface({
      input: stdin,
      output: stdout,
    });

    this._onKeypress = this._onKeypress.bind(this);
    this._onData = this._onData.bind(this);
    this._onInterrupt = this._onInterrupt.bind(this);
    this._onExit = this._onExit.bind(this);
  }
  
  add(text, value) {
    if(value === undefined) value = text;
    this._options.push({
      text,
      value,
      checked: false,
    });
    return this;
  };

  render() {
    const self = this;
    const config = this._config;
    const colorize = {
      wrapper: chalk[config.markWrapperColor],
      cursor: chalk[config.cursorColor],
      checked: chalk[config.checkedMarkColor],
      unchecked: chalk[config.uncheckedMarkColor],
      text: chalk[config.textColor],
    }

    this._options.forEach((option, index) => {
      const cursorText = self._cursor === index ? config.cursor : ' ';
      const checkedText = (option.checked) ? colorize.checked(config.checkedMark) : colorize.unchecked(config.uncheckedMark);

      const text = [
        colorize.cursor(cursorText),
        colorize.wrapper(config.markWrapperLeft),
        checkedText,
        colorize.wrapper(config.markWrapperRight),
        ' ',
        colorize.text(option.text),
      ];

      if(self._cursor === index && config.highlight) {
        text[5] = chalk.inverse(text[5]);
      }

      console.log(text.join(''));
    });

    if(!this._initialized) {
      this._bindEvents();
      this._promise = new Promise((resolve, reject) => {
        self._resolve = resolve;
        self._reject = reject;
      });
    }

    stdout.write(_encode('[?25l'));

    return this._promise;
  };

  _clear(isReturnKeyPressed) {
    readline.cursorTo(stdout, 0);
    readline.moveCursor(stdout, 0, -this._options.length - (isReturnKeyPressed ? 1 : 0));
    readline.clearScreenDown(stdout);
  };

  _refresh() {
    this._clear();
    this.render();
  }

  _move(relPos) {
    this._cursor += relPos;
    
    if(this._cursor >= this._options.length) {
      this._cursor = this._options.length - 1;
    }
    
    if(this._cursor < 0) {
      this._cursor = 0;
    }
    
    this._refresh();
  }

  _uncheck() {
    const options = this._options;
    const cursor = this._cursor;

    if(options[cursor] !== undefined && options[cursor].checked) {
      options[cursor].checked = false;
      --this._selectedCount;
    }

    this._refresh();
  }

  _check() {
    const options = this._options;
    const config = this._config;
    const cursor = this._cursor;

    if(options[cursor] !== undefined && !options[cursor].checked) {
      if(config.multiselect === true || this._selectedCount === 0){
        options[cursor].checked = true;
        ++this._selectedCount;
      }
    }

    this._refresh();
  }

  _checkToggle() {
    const options = this._options;
    const config = this._config;
    const cursor = this._cursor;

    if(options[cursor] !== undefined) {
      if(!options[cursor].checked === true) {
        if(config.multiselect === true || this._selectedCount === 0){
          options[cursor].checked = true;
          ++this._selectedCount;
        }
      } else {
        options[cursor].checked = false;
          --this._selectedCount;
      }
    }

    this._refresh();
  }

  _bindEvents() {
    stdin.on('keypress', this._onKeypress);
    stdin.on('data', this._onData);
    process.on('SIGINT', this._onInterrupt);
    process.on('exit', this._onExit);
    this._initialized = true;
  }

  _unbindEvents() {
    stdin.removeListener('keypress', this._onKeypress);
    stdin.removeListener('data', this._onData);
    process.removeListener('SIGINT', this._onInterrupt);
    process.removeListener('exit', this._onExit);
    this._initialized = false;
  }

  _done() {
    this._clear(true);
    this._unbindEvents();
    stdout.write(_encode('[?25h'));
    this._io.close();
    this._resolve(
      this._options.filter(o => o.checked === true).map(o => o.value)
    );
  }

  _onKeypress(str, key) {
    switch(key.name) {
      case 'up':
        this._move(-1);
        break;
      case 'down':
        this._move(1);
        break;
      case 'left':
        this._uncheck();
        break;
      case 'right':
        this._check();
        break;
      case 'space':
        this._checkToggle();
        break;
      case 'return':
        this._done();
        break;
      case 'escape':
        this._reject('User cancled'); 
        this._clear();
        this._unbindEvents();
        break;
      default:
        break;
    }
  }

  _onData() {
    readline.clearLine(stdout);
  }
  
  _onInterrupt() {
    this._reject('Interrupted');
    process.exit(1);
  }
  
  _onExit() {
    this._io.close();
    stdout.write(_encode('[?25h'));
  }
};



module.exports = Selector;