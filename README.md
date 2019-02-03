# node-option

An item selection module for interactive shell applications.

![](https://raw.githubusercontent.com/blurfx/node-option/master/example.gif)


## Installation

`npm install node-option`

## API

### add(text, value)

Adds the options that you want to select.

If no value is given, the given text will be a value.

### render()

Displays a options on the shell and allows the user to select.


## Usage

#### Javascript

```javascript
const Selector = require('./index');

const selector = new Selector({
  bracketColor: 'blue',
  markColor: 'white',
  textColor: 'yellowBright',
  highlight: true,
});

const result = selector
                .add('One')
                .add('Two')
                .add('Three')
                .add('Four')
                .render();

result.then((value) => {
  console.log(value);
}, (error) => {
  console.log(error);
});
```

#### Typescript

```typescript
import Selector from 'node-option';

const selector = new Selector({
  bracketColor: 'blue',
  markColor: 'white',
  textColor: 'yellowBright',
  highlight: true,
});

const result = selector
    .add('One')
    .add('Two')
    .add('Three')
    .add('Four')
    .render();

result.then((value) => {
    console.log(value);
}, (error) => {
    console.error(error);
})
```

## Configuration

`node-option` uses `chalk` to styling. You can check available colors [here](https://github.com/chalk/chalk#colors).

```javascript
{
    cursor: '>',            // character of pointer
    checked: '✓',           // character to mark selected item
    unchecked: ' ',         // character to mark unselected item
    cursorColor: 'cyan',    // color of cursor
    bracketColor: 'white',  // color of bracket
    markColor: 'green',     // color of checked mark
    textColor: 'yellow',    // color of text
    multiselect: true,      // whether to select multiple items.
    highlight: true,        // Whether to highlight item that cursor points.
}
`