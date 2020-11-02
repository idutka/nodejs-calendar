const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./utils/logger');
const asyncLocalStorage = require('./utils/asyncLocalStorage');

const db = require('./models');
const config = require('./config/config');
const events = require('./routes/events.js');
const users = require('./routes/users.js');
const auth = require('./routes/auth.js');

const init = async () => {
  await db.sequelize.sync();

  const app = express();
  app.use(bodyParser.json());
  app.use(asyncLocalStorage.middleware());

  app.use('/events', events.router);
  app.use('/users', users.router);
  app.use('/', auth.router);

  app.listen(config.PORT, () => {
    logger.info(`Server start at port ${config.PORT}`);
  });
}

process.on('unhandledRejection', reason => {
  logger.error(`Unhandled Rejection at Promise: ${reason}`);
})
process.on('uncaughtException', err => {
  logger.error(`Uncaught Exception thrown: ${err.stack}`);
  process.exit(1);
});

init();
