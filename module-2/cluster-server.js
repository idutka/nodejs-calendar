const cluster = require('cluster');
const http = require('http');

const NUMBER_OF_CLUSTER = 6;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < NUMBER_OF_CLUSTER; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker) => {
    console.log(`Cluster ${worker.process.pid} died`);
  });
} else {
  let count = 0;
  http.createServer((req, res) => {
    count += 1;
    const result = `Cluster ${process.pid} was called ${count} times`;
    console.log(result)

    res.writeHead(200);
    res.end(result);
  }).listen(3000);

  console.log(`Cluster ${process.pid} started`);
}
