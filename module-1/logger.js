const {createLogger, format, transports} = require('winston');
const path = require('path');

const errorFilePath = path.join(__dirname, 'error.log');
const combinedFilePath = path.join(__dirname, 'combined.log');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    format.metadata(),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({filename: errorFilePath, level: 'error'}),
    new transports.File({filename: combinedFilePath}),
  ],
});

module.exports = logger;
