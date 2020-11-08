const {AsyncLocalStorage} = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();

const helpers = require('./helpers');

const middleware = (instance = asyncLocalStorage) => (req, res, next) => {
  req.id = helpers.getRandomId();
  instance.run({req, res}, () => {
    next();
  });
}

module.exports.instance = asyncLocalStorage;
module.exports.middleware = middleware;
