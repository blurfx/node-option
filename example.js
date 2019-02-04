const Selector = require('./index');

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

