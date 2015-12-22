var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');

var sha256 = function(pwd) {
  var hash = crypto.createHash('sha256').update(pwd).digest('base64');
  return hash;
};

var clients = [];

app.use(express.static('public'));

io.on('connection', function(socket){
  socket.uid = sha256(socket.handshake.address).substring(0,5);
  console.info('New client connected (id='+ socket.id +').');
  clients.push(socket);
  socket.emit('login','Welcome!');
  socket.on('chat message', function(msg){
	if (msg.length > 128) {
		msg = 'I am a bad boy that likes to spam.';
	}
	if (msg == '/ping') {
		io.emit('chat message', 'Server: Pong');
	} else {
		io.emit('chat message', socket.uid+': '+msg);
	}
  });
  
  socket.on('disconnect', function() {
        var index = clients.indexOf(socket);
        if (index != -1) {
            clients.splice(index, 1);
            console.info('Client gone (id=' + socket.id + ').');
        }
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});