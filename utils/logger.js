const {createLogger, format, transports} = require('winston');
const path = require('path');

const asyncLocalStorage = require('./asyncLocalStorage');

const errorFilePath = path.join(__dirname, '..', 'logs', 'error.log');
const combinedFilePath = path.join(__dirname, '..', 'logs', 'combined.log');

const addRequestInfo = format(info => {
  const data = asyncLocalStorage.instance.getStore();
  if (data && data.req) {
    info.reqOriginalUrl = data.req.originalUrl;
    info.reqMethod = data.req.method;
    info.reqId = data.req.id;
  }
  return info;
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    addRequestInfo(),
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
