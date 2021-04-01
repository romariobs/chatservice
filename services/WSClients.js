
const clients = {};

function WSClients(socket) {

  let CLIENT_USER = '';


  socket.on('open', function() {
    console.log('open '+ clients.length);
    
  });
  socket.on('error', function() {
    console.log('error');
  });
  socket.on('message', function(data) {
    console.log("#@### clientes lenght", clients.length, "CLIENT_USER", CLIENT_USER)
    console.log('receive: ' + data);
    let json = JSON.parse(data);
    switch (json.type) {
      case 'MSG_TO':
      case 'MSG_ALL':
        for (const user in clients) {
          if (clients.hasOwnProperty(user)) {
            const client = clients[user];
            client.send(data);
          }
        }
        break;
      case 'MSG_PM_TO':
        if (clients.hasOwnProperty(json.to) && clients.hasOwnProperty(json.from)) {
          clients[json.to].send(data);
          clients[json.from].send(data);
        }
        break;
      case 'USER_CREATE':
        let response = {}
        if (clients.hasOwnProperty(json.user)) {
          response['type'] = 'USER_DUPLICATED';
          socket.send(JSON.stringify(response));
          socket.close();
        } else {
          response['type'] = 'USER_CONNECTED';
          response['user'] = json.user;
          clients[json.user] = socket;
          CLIENT_USER = json.user;
          for (const user in clients) {
            if (clients.hasOwnProperty(user)) {
              const client = clients[user];
              client.send(JSON.stringify(response));
            }
          }
        }
        break;
      case 'USER_EXIT':
        socket.close();
      default:
        break;
    }
  });

  socket.on('close', function() {
    let disconnectedUser = CLIENT_USER;
    delete clients[disconnectedUser];
    let response = { type: 'USER_DISCONNECTED', user: disconnectedUser }
    for (const user in clients) {
      if (clients.hasOwnProperty(user)) {
        const client = clients[user];
        client.send(JSON.stringify(response));
      }
    }
  });

}

module.exports = WSClients;