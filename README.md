# Chatbox
Chat using websocket native from NodeJS, actually implementing websocket to NodeJS using native .
by [romariobs](https://github.com/romariobs)

# How to start the application?
* Install Docker (https://docs.docker.com/install/)
* Install docker-compose (https://docs.docker.com/compose/install/)
* Start application with `docker-compose up --build` and wait...
* Open the browser and enter the URL `http://localhost:3000`
* Now you can use a simple UI with the websocket connected.

# The Solution

In this code we have a server with the capacity to send and receive messages through websockets. Over here you will encounter the following _type_ messages:
* __MSG_TO__: When you send a message to someone in a channel:
    {'type': 'MSG_TO', 'message': '', 'from': 'USER',  'to': 'SOMEONE'}
* __MSG_ALL__: You will send a message to everyone in the channel:
    {'type': 'MSG_ALL', 'message': '', 'from': 'USER',  'to': ''}
* __MSG_PM_TO__: You will send a privately message to a user:
    {'type': 'MSG_PM_TO', 'message': '', 'from': 'USER',  'to': 'SOMEONE'}
* __USER_CREATE__: Try to join a new user to the channel:
    {'type': 'USER_CREATE', 'user': 'newUser'}
* __USER_EXIT__: User opt to exit from chat.
    {'type': 'USER_EXIT'}
