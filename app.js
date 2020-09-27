const http = require('http');

const { PORT } = require('./config');
const { log } = require('./logger');

http.createServer((req, res) => {
    log('New incoming request');
    res.writeHeader(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello world!' }));
}).listen(3000, () => log(`Listening on port ${PORT}...`));
