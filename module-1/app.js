const http = require('http');

const { PORT } = require('./config');
const logger = require('./logger');

http.createServer((req, res) => {
    logger.info('New incoming request');
    res.writeHeader(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello world!' }));
}).listen(PORT, () => logger.info(`Listening on port ${PORT}...`));
