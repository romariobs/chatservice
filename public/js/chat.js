
$(document).ready(function(){
  const chatbox = document.getElementById('chatbox');
  const login = document.getElementById('enterUser');
  chatbox.style.display = "none";
  login.style.display = "block";
  let SESSION_USER = '';

  let ws = null;

  $('form#enterUser').submit(function(evt) {
    evt.preventDefault();
    let userInput = document.getElementById('username-input');
    if (typeof userInput.value !== 'undefined' && userInput.value.trim() !== '') {
      ws = new WebSocket(`ws://${window.location.hostname}:3000`);
      ws.addEventListener('open', ()=> {
        chatbox.style.display = "block";
        login.style.display = "none";
        const createUser = { type: 'USER_CREATE', user: userInput.value.trim() }
        SESSION_USER = userInput.value.trim();
        ws.send(JSON.stringify(createUser));
      })
      ws.addEventListener('message', onMessageReceive);
      ws.addEventListener('close', () => {
        SESSION_USER = '';
        chatbox.style.display = "none";
        login.style.display = "block";
      });
    }
  });

  $('form#chat').submit(function(e) {
    e.preventDefault();
    let newMessage = document.getElementById('chatbox-input').value;
    if (typeof newMessage !== 'undefined' && newMessage !== '') {
      const wsData = { message: newMessage, from: SESSION_USER, to: ""};
      let words = newMessage.split(" ");
      if (words[0].startsWith("@")) {
        wsData['type'] = "MSG_TO";
        wsData['to'] = words[0].slice(1);
        wsData['message'] = newMessage.slice(words[0].length)
      } else if (words[0] === "/p") {
        wsData['type'] = "MSG_PM_TO";
        wsData['to'] = words[1];
        wsData['message'] = newMessage.slice(words[0].length + words[1].length + 2);
      } else if (words[0] === "/exit") {
        wsData['type'] = "USER_EXIT";
      } else {
        wsData['type'] = "MSG_ALL";
      }
      
      const json = JSON.stringify(wsData);
      ws.send(json);
      document.getElementById('chatbox-input').value = "";
    }
  })

  const onMessageReceive = (event) => {
    if (typeof event.data !== 'undefined') {
      const messageObj = JSON.parse(event.data);
      let messageFormatted = '';

      switch (messageObj.type) {
        case 'MSG_ALL':
          messageFormatted = `${messageObj.from} diz: ${messageObj.message}`
          break;
        case 'MSG_TO':
          messageFormatted = `${messageObj.from} diz para ${messageObj.to}: ${messageObj.message}`
          break;
        case 'MSG_PM_TO':
          messageFormatted = `${messageObj.from} diz particulamente para ${messageObj.to}: ${messageObj.message}`
          break;
        case 'USER_DISCONNECTED':
          messageFormatted = `Usuário ${messageObj.user} desconectou do canal #geral`
          break;
        case 'USER_CONNECTED':
          messageFormatted = `Usuário ${messageObj.user} juntou-se ao canal #geral`
          break;
        default:
          break;
      }

      if (messageFormatted !== '') {
        let chatMessageUi = $("<p />").text(messageFormatted);
        $('#chatbox-content').append(chatMessageUi);
      }
    }
  };


});








