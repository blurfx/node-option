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
const Selector = require('node-option');

const selector = new Selector({
  markWrapperColor: 'blue',
  checkedMarkColor: 'white',
  textColor: 'yellow',
  multiselect: true,
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
    markWrapperColor: 'blue',
    checkedMarkColor: 'white',
    textColor: 'yellow',
    multiselect: true,
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
    cursor: '>',                  // string to item cursor
    checkedMark: '✓',             // string to mark of selected item
    uncheckedMark: ' ',           // string to mark of unselected item
    markWrapperLeft: '[',         // string to the left of the checked/unchecked mark
    markWrapperRight: ']',        // string to the right of the checked/unchecked mark
    cursorColor: 'cyan',          // color of cursor
    checkedMarkColor: 'green',    // color of checked mark
    uncheckedMarkColor: 'black',  // color of cunhecked mark
    markWrapperColor: 'white',    // color of markWrapperLeft and markWrapperRight
    textColor: 'yellow',          // color of item text
    multiselect: true,            // whether to allow select multiple items
    highlight: true,              // whether to highlight item that cursor points
}
`