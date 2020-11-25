const fs = require('fs');
const path = require('path');
const WebSocketServer = require('websocket').server;
const helpers = require('../utils/helpers');
const logger = require('../utils/logger');

const connections = {};

const sendMessage = (connection, type, message) => {
  connection.sendUTF(JSON.stringify({type, message}));
}

const sendMessageToAll = (type, message) => {
  for (let connection of Object.values(connections)) {
    if (connection) sendMessage(connection, type, message)
  }
}

const saveFile = (fileName, data, cb) => {
  const filePath = path.join(__dirname, '..', 'files', fileName);
  fs.writeFile(filePath, data, cb);
}

module.exports.init = (server) => {
  const wsServer = new WebSocketServer({
    httpServer: server,
  });

  wsServer.on('request', (request) => {
    const id = helpers.getRandomId();
    let fileName = ''; // todo handle concurrency

    const connection = request.accept(null, request.origin);
    connections[id] = connection;

    logger.info(`Connected ${id}`);

    connection.on('message', (message) => {
      if (message.type === 'utf8') {
        try {
          const data = JSON.parse(message.utf8Data);

          switch (data.type) {
            case 'hello': {
              sendMessage(connection, 'hello', 'Hello Client!');
              break;
            }
            case 'startFileUpload': {
              fileName = data.message;
              break;
            }
            default: {
              logger.info('Unknown message type');
            }
          }

        } catch (e) {
          logger.info('Wrong message');
        }
      } else if (message.type === 'binary') {
        logger.info('Received Binary Message of ' + message.binaryData.length + ' bytes');

        saveFile(fileName, message.binaryData, () => {
          sendMessageToAll('newFile', fileName);
        })
      }
    });
    connection.on('close', () => {
      logger.info(`Disconnected ${id}`);
      delete connections[id];
    });
  });
}
