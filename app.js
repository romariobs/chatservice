const fs = require('fs');
const path = require('path');
const WebSocket = require('./lib/websocket');
const WSClients = require('./services/WSClients');

const app = (req, res) => {
  let staticFile = "";
  if(req.url == "/"){
    staticFile = path.join(__dirname, 'public/index.html');
  }else{
    staticFile = path.join(__dirname, 'public', req.url);
  }
  fs.readFile(staticFile, (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end("Error on connect with chat");
    }
    res.writeHead(200);
    res.end(data);
  });
}

const ws = WebSocket.createServer(app);
ws.on('connect', WSClients).listen(3000);

