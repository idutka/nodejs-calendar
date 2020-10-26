const http = require('http');

const callServer = (requestIndex) => {
  http.get('http://localhost:3000', (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(`Request #${requestIndex}: ${data}`);
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

const NUMBER_REQUEST = 100;

for (let i = 0; i < NUMBER_REQUEST; i++) {
  callServer(i);
}
