const {longComputation} = require('./utils');

process.on('message', (message) => {
  console.log(message);
  longComputation();
  process.send({done: true});
});
