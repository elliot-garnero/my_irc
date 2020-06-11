const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['general', 'Video games', 'Dev', 'Music', 'Computers'];

io.on('connection', (socket) => {

  // Set date
  let today = new Date();
  function goodMinutes() {
    return today.getMinutes() < 10 ? '0' : '';
  }
  let date = today.getHours() + 'H' + goodMinutes() + today.getMinutes();

// Create a new user
socket.on('newUser', (user) => { console.log('new :', user)
  socket.username = user;
  socket.room = 'general';
  usernames[user] = user;
  socket.join('general');
  socket.emit('updatechat', 'SERVER', 'you have connected to general channel',date, socket.room);
  socket.broadcast.to('general').emit('updatechat', 'SERVER', user + ' has connected to this room');
  socket.emit('updaterooms', rooms, 'general');
  console.log(socket.username);
  emitVisitors();
});
//change or create room
socket.on('switchRoom', function(newroom){
  //if room does'nt exist, create room
  if(!rooms.includes(newroom)){
    rooms.push(newroom);
    socket.myroom = newroom;
    socket.broadcast.emit('updatechat', 'SERVER', socket.username+' has created a new room : '+newroom);
  }
  socket.leave(socket.room);
  socket.join(newroom);
  socket.emit('updatechat', 'SERVER', 'you have connected to room : '+ newroom)
  socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
  socket.room = newroom;
  socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
  socket.emit('updaterooms', rooms, newroom);
});

socket.on('switchName', function(name){
let oldname = socket.username;
  if(!usernames[name]){
    usernames[name] = name;
    socket.username = name;
    socket.broadcast.emit('updatechat', 'SERVER', oldname + ' has changed his name : '+name);
    io.to(socket.id).emit('updatechat','SERVER','your username has been changed');
    socket.emit('updatename', name);
    emitVisitors();
  }
  else{
    io.to(socket.id).emit('updatechat','SERVER','This username already exists, please choose another one');
  }
  
});

// when the client emits 'sendchat', this listens and executes
socket.on('sendchat', function (data) {
  switch(data){
    case 'nick':
      function name(data);
    break;
    case 'list':
      function listServer(data);
    break;
    case 'server':
      function createServer(data);
    break;
    case 'delete':
      function deleteServer(data);
    break;
    case 'join':
      function joinServer(data);
    break;
    case 'part':
      function quitServer(data);
    break;
    case 'users':
      function listUsers(data);
    break;
    case 'msg':
      io.sockets.in(socket.room).emit('updatechat', socket.username, data, date);
    break;
    default:
    io.sockets.in(socket.room).emit('updatechat', socket.username, data, date);
    break;
  }
});

  // when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
    delete usernames[socket.username];
    emitVisitors();
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});

const getAllUsers = () => {
  let users = io.sockets.clients().connected;
  let usersArray = Object.values(users);
  let usersMap = usersArray.map((s) => s.username);
  return usersMap;
};

const emitVisitors = () => {
  io.emit('visitors', getAllUsers());
};

function name(data){
  let oldname = socket.username;
  if(!usernames[name]){
    usernames[name] = name;
    socket.username = name;
    socket.broadcast.emit('updatechat', 'SERVER', oldname + ' has changed his name : '+name);
    io.to(socket.id).emit('updatechat','SERVER','your username have been changed');
    socket.emit('updatename', name);
    emitVisitors();
  }
  else{
    io.to(socket.id).emit('updatechat','SERVER',' This username already exists, please choose another one');
  }
}

function listServer(){
  let data = rooms.toString()
  io.to(socket.id).emit('updatechat','SERVER',data);
}

function createServer(data){
  if(!rooms.includes(newroom)){
    rooms.push(newroom);
    socket.myroom = newroom;
    socket.broadcast.emit('updatechat', 'SERVER', socket.username+' has created a new room : '+newroom);
  }
  else{
    io.to(socket.id).emit('updatechat','SERVER',' This channel already exists, please choose another one');
  }
}

function deleteServer(data){
  if(socket.myroom == data){
    for( var i = 0; i < rooms.length; i++){
      if ( rooms[i] === data) { rooms.splice(i, 1);
      }
    }
    socket.broadcast.emit('updatechat', 'SERVER', socket.username+' has delete his room : '+data);
  }
  else{
    io.to(socket.id).emit('updatechat','SERVER',' You can\'t delete this room, it\'s not yours');
  }
}

function joinServer(data){
  socket.leave(socket.room);
  socket.join(newroom);
  socket.emit('updatechat', 'SERVER', 'you have connected to room : '+ newroom)
  socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
  socket.room = newroom;
  socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
  socket.emit('updaterooms', rooms, newroom);
}

function quitServer(data){
  socket.leave(socket.room);
  socket.join('general');
  socket.emit('updatechat', 'SERVER', 'you have connected to room : general')
  socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
  socket.room = 'general';
  socket.broadcast.to('general').emit('updatechat', 'SERVER', socket.username+' has joined this room');
}

function listUsers(){
  let data = Array.from(usernames);
  io.to(socket.id).emit('updatechat','SERVER',data);
}


http.listen(4000, function () {
  console.log('Server running on port 4000');
});
