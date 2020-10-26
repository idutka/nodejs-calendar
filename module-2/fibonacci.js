const http = require('http');
const url = require('url');
const {Worker, isMainThread, parentPort, workerData} = require('worker_threads');

const {fibonacci} = require('./utils')

if (isMainThread) {
  http.createServer((req, res) => {
    const {num} = url.parse(req.url, true).query;
    console.log(`Calculating Fibonacci number for ${num}`);

    const worker = new Worker(__filename, {workerData: parseInt(num)});
    worker.on('message', (result) => {
      console.log(`Calculated Fibonacci number for ${num}: ${result}`);
      res.writeHeader(200);
      res.end(`F(${num}) = ${result}\n`);
    });
    worker.on('error', error => {
      console.log(error)
      res.writeHeader(400);
      res.end();
    });
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.log(`Worker stopped with exit code ${code}`)
        res.writeHeader(400);
        res.end();
      }
    });
  }).listen(3000, () => console.log('Listening on port 3000...'));
} else {
  parentPort.postMessage(fibonacci(workerData));
}
