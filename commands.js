function name(data) {
  let oldname = socket.username;
  if (!usernames[name]) {
    usernames[name] = name;
    socket.username = name;
    socket.broadcast.emit(
      'updatechat',
      'SERVER',
      oldname + ' has changed his name : ' + name
    );
    io.to(socket.id).emit(
      'updatechat',
      'SERVER',
      'your username have been changed'
    );
    socket.emit('updatename', name);
    emitVisitors();
  } else {
    io.to(socket.id).emit(
      'updatechat',
      'SERVER',
      ' This username already exists, please choose another one'
    );
  }
}

function listServer() {
  let data = rooms.toString();
  io.to(socket.id).emit('updatechat', 'SERVER', data);
}

function createServer(data) {
  if (!rooms.includes(newroom)) {
    rooms.push(newroom);
    socket.myroom = newroom;
    socket.broadcast.emit(
      'updatechat',
      'SERVER',
      socket.username + ' has created a new room : ' + newroom
    );
  } else {
    io.to(socket.id).emit(
      'updatechat',
      'SERVER',
      ' This channel already exists, please choose another one'
    );
  }
}

function deleteServer(data) {
  if (socket.myroom == data) {
    for (var i = 0; i < rooms.length; i++) {
      if (rooms[i] === data) {
        rooms.splice(i, 1);
      }
    }
    socket.broadcast.emit(
      'updatechat',
      'SERVER',
      socket.username + ' has delete his room : ' + data
    );
  } else {
    io.to(socket.id).emit(
      'updatechat',
      'SERVER',
      " You can't delete this room, it's not yours"
    );
  }
}

function joinServer(data) {
  socket.leave(socket.room);
  socket.join(newroom);
  socket.emit(
    'updatechat',
    'SERVER',
    'you have connected to room : ' + newroom
  );
  socket.broadcast
    .to(socket.room)
    .emit('updatechat', 'SERVER', socket.username + ' has left this room');
  socket.room = newroom;
  socket.broadcast
    .to(newroom)
    .emit('updatechat', 'SERVER', socket.username + ' has joined this room');
  socket.emit('updaterooms', rooms, newroom);
}

function quitServer(data) {
  socket.leave(socket.room);
  socket.join('general');
  socket.emit('updatechat', 'SERVER', 'you have connected to room : general');
  socket.broadcast
    .to(socket.room)
    .emit('updatechat', 'SERVER', socket.username + ' has left this room');
  socket.room = 'general';
  socket.broadcast
    .to('general')
    .emit('updatechat', 'SERVER', socket.username + ' has joined this room');
}

function listUsers() {
  let data = Array.from(usernames);
  io.to(socket.id).emit('updatechat', 'SERVER', data);
}
