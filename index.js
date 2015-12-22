var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var crypto = require('crypto');

var sha256 = function(pwd) {
  var hash = crypto.createHash('sha256').update(pwd).digest('base64');
  return hash;
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.sessionid = sha256(socket.handshake.address).substring(0,5);
  socket.on('chat message', function(msg){
	if (msg == '/ping') {
		io.emit('chat message', 'Server: Pong');
	} else {
		io.emit('chat message', socket.sessionid+': '+msg);
	}
  });
});

http.listen(80, function(){
  console.log('listening on *:80');
});