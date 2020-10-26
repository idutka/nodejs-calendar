const http = require('http');
const {AsyncLocalStorage} = require('async_hooks');
const logger = require('../module-1/logger')

const asyncLocalStorage = new AsyncLocalStorage();

const events = [
  {
    "id": "1",
    "title": "Event 1",
    "location": "Lviv",
    "date": "2020-10-21",
    "hour": "22:00"
  },
  {
    "id": "2",
    "title": "Event 2",
    "location": "Kiev",
    "date": "2020-11-11",
    "hour": "19:15"
  }
];

const getBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = Buffer.from([])
    req.on('data', (chunk) => {
      body = Buffer.concat([body, chunk])
    });
    req.on('error', (err) => {
      reject(err)
    })
    req.on('end', () => {
      resolve(body.toString())
    });
  });
}

const actions = {
  'GET': async () => {
    const {req, res} = asyncLocalStorage.getStore();
    const url = req.url;

    if (url === '/events') {
      req.log.info('GET /events - was triggered')
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(events));
    } else if (/^\/events\/(\d+)$/.test(url)) {
      req.log.info('GET /events/:1d - was triggered')
      const [, id] = url.match(/^\/events\/(\d+)$/)

      const event = events.find(({id: currentId}) => currentId === id);
      if (!event) {
        res.writeHead(404)
        res.end();
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(event));
    } else if (url === '/reject') {
      req.log.info('GET /reject- was triggered')
      Promise.reject('Custom Rejection');
    } else if (url === '/timeout') {
      setTimeout(() => {
        const {req: timeoutReq, res: timeoutRes} = asyncLocalStorage.getStore();
        timeoutRes.writeHead(200)
        timeoutRes.end(timeoutReq.url);
      }, 1000)
    } else {
      req.log.error('GET Bad request')
      res.writeHead(400)
      res.end();
    }
  },
  'POST': async () => {
    const {req, res} = asyncLocalStorage.getStore();
    const url = req.url;

    if (url === '/events') {
      req.log.info('POST /events - was triggered')
      const body = await getBody(req);
      const data = JSON.parse(body);

      const id = Math.random().toString().substr(2, 6);
      const newItem = {...data, id};
      events.push(newItem);

      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(newItem));
    } else {
      req.log.error('POST Bad request')
      res.writeHead(400)
      res.end();
    }
  }
}

http.createServer(function (req, res) {
  const action = actions[req.method];
  req.log = logger.child({url: req.url, method: req.method, headers: req.headers});

  if (action) {
    asyncLocalStorage.run({req, res}, () => {
      action();
    });
  } else {
    throw new Error('Custom Error');
  }
}).listen(3000, () => {
  logger.info('Server start at port 3000');
});

process.on('unhandledRejection', reason => {
  logger.error(`Unhandled Rejection at Promise: ${reason}`);
})
process.on('uncaughtException', err => {
  logger.error(`Uncaught Exception thrown: ${err.stack}`);
  process.exit(1);
});
