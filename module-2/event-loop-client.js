const http = require('http');

const callServer = (requestIndex) => {
  const start = new Date();
  http.get('http://localhost:3000', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(`Request #${requestIndex}: ${new Date() - start}ms`);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

const NUMBER_REQUEST = 5;

for (let i = 0; i < NUMBER_REQUEST; i++) {
  callServer(i);
}
