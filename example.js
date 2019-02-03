const Selector = require('./index');

const selector = new Selector({
  bracketColor: 'blue',
  markColor: 'white',
  textColor: 'yellowBright',
  multiselect: false,
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

