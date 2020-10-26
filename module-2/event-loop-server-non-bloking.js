const http = require('http');
const {fork} = require('child_process');

http.createServer((req, res) => {
  const start = new Date();
  const n = fork(`${__dirname}/event-loop-server-non-bloking-sub.js`);

  n.on('exit', () => {
    console.log('Child process exited');
  });
  n.on('message', () => {
    res.writeHead(200);
    res.end(`${new Date() - start}\n`);
    n.kill();
  });
  n.send('start');

}).listen(3000, () => console.log(`Listening on port 3000...`));
