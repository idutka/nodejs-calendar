const fs = require('fs');

fs.readFile(`${__dirname}/utils.js`, 'utf8', () => {
  console.log('read utils.js');
});
fs.readFile(`${__dirname}/microtasks.js`, 'utf8', () => {
  console.log('read microtasks.js');
});

setTimeout(() => console.log('setTimeout'), 2);
