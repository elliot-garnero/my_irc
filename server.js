const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['general', 'room1','room2','room3'];

io.on('connection', (socket) => {

  // Set date
  let today = new Date();
  var options = { month: 'long' };
  let month = new Intl.DateTimeFormat('en-US', options).format(today);
  let date =
    today.getFullYear() +
    '/' +
    month +
    '/' +
    today.getDate() +
    ' at ' +
    today.getHours() +
    'H' +
    today.getMinutes();

// when the client emits 'newUser', this listens and executes
socket.on('newUser', (user) => { console.log('new :', user)
  // store the username in the socket session for this client
  socket.username = user;
  // store the room name in the socket session for this client
  socket.room = 'general';
  // add the client's username to the global list
  usernames[user] = user;
  // send client to room 1
  socket.join('general');
  // echo to client they've connected
  socket.emit('updatechat', 'SERVER', 'you have connected to general channel',date, socket.room);
  // echo to room 1 that a person has connected to their room
  socket.broadcast.to('general').emit('updatechat', 'SERVER', user + ' has connected to this room');
  socket.emit('updaterooms', rooms, 'general');
  console.log(socket.username);
    console.log(socket.room)
    console.log(socket.id)
    console.log(usernames)
    console.log(rooms)
    emitVisitors();
});

socket.on('switchRoom', function(newroom){
  // leave the current room (stored in session)
  socket.leave(socket.room);
  // join new room, received as function parameter
  socket.join(newroom);
  socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
  // sent message to OLD room
  socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
  // update socket session room title
  socket.room = newroom;
  (rooms.includes(newroom) ? rooms.includes(newroom) : rooms.push(newroom))
  socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
  socket.emit('updaterooms', rooms, newroom);
});

socket.on('switchName', function(name){
let oldname = socket.username;
  if(!usernames[name]){
    usernames[name] = name;
    socket.username = name;
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', oldname + ' has changed his name : '+name);
    io.to(socket.id).emit('updatechat','SERVER','your username have been changed');
    socket.emit('updatename', name);
  }
  else{
    io.to(socket.id).emit('updatechat','SERVER','This username already exists');
  }
  
});

// when the client emits 'sendchat', this listens and executes
socket.on('sendchat', function (data) {
  // we tell the client to execute 'updatechat' with 2 parameters
  io.sockets.in(socket.room).emit('updatechat', socket.username, data);
});

  // when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
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
  let usersMap = usersArray.map((s) => s.user);
  return usersMap;
};

const emitVisitors = () => {
  io.emit('visitors', getAllUsers());
};

http.listen(4000, function () {
  console.log('Server running on port 4000');
});
