const util = require('util')
const events = require('events')

var STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

module.exports = exports = WebSocket;

var EVTS = ['close', '_closing', 'connect', 'error', 'message'], length = EVTS.length;

function WebSocket() {
  var self = this;
  events.EventEmitter.call(self);

  self.readyState = STATE.CONNECTING;

  self.on('error', function(err) {
    self.close(err && err.message);
    if('function' === typeof self.onerror)
      self.onerror(err);
  });

  self.on('close', function() {
    self.readyState = STATE.CLOSED;
    if('function' === typeof self.onclose)
      self.onclose();
  });

  self.on('open', function() {
    self.readyState = STATE.OPEN;
    if('function' === typeof self.onopen)
      self.onopen();
  });

  self.on('message', function() {
    if('function' === typeof self.onmessage)
      self.onmessage();
  });

  self.on('_closing', function(reason) {
    self.readyState = STATE.CLOSING;
    process.nextTick(function() {
      close.call(self, reason);
    });
  });

  self.on('connect', function() {
    self.emit('open');
  });

  var args = arguments;
  process.nextTick(function() {
    handShake.apply(self, args);
  });
}
util.inherits(WebSocket, events.EventEmitter);

function handShake() {
  var self = this;
  var arg0 = arguments[0], arg1 = arguments[1], arg2 = arguments[2], arg3 = arguments[3];

  const Protocol = require('./rfc6455');
  var protocol = self.protocol = new Protocol(arg0, arg1, arg2, arg3);

  var i = length, evts = EVTS;
  for(; i--;)
    _bubbling(evts[i], protocol, self);

  self.on('connect', function(socket) {
    self.secure = !!socket.encrypted;
    var _socket = socket['socket'] || socket;
    _socket.setTimeout(0);
    _socket.setNoDelay(true);
    _socket.setKeepAlive(true, 0);
  });
  protocol.handShake.apply(protocol, arguments);

};

function close(reason) {
  var self = this, protocol = self.protocol;
  self.send = function() {
  };
  protocol.close(reason);
}

WebSocket.prototype.send = function() {
  var protocol = this.protocol;
  protocol.write.apply(protocol, arguments);
};

WebSocket.prototype.close = function(reason) {
  this.emit('_closing');
};

WebSocket.prototype.addEventListener = WebSocket.prototype.addListener;

function _bubbling(evt, from, to) {
  from.on(evt, function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(evt);
    to.emit.apply(to, args);
  });
}
