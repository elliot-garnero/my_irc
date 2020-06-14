// Commands to type in chat //

  // Change users name
  function name(data) {
    let oldname = socket.username;
    if (!usernames[data]) {
      usernames[data] = data;
      socket.username = data;
      socket.broadcast.emit(
        'updatechat',
        'SERVER',
        oldname + ' has changed his name : ' + data
      );
      io.to(socket.id).emit(
        'updatechat',
        'SERVER',
        'Your username have been changed'
      );
      socket.emit('updatename', data);
      emitVisitors();
    } else {
      io.to(socket.id).emit(
        'updatechat',
        'SERVER',
        ' This username already exists, please choose another one'
      );
    }
  }

  function listServer(expression) {
    if (
      expression == '' ||
      typeof expression == undefined ||
      typeof expression == null
    ) {
      let data = rooms.toString();
      io.to(socket.id).emit('updatechat', 'SERVER', data);
    } else {
      let result = rooms.filter((word) =>
        word.toLowerCase().includes(expression.toLowerCase())
      );
      let data = result.toString();
      io.to(socket.id).emit('updatechat', 'SERVER', data);
    }
  }

  function createServer(data) {
    if (!rooms.includes(data)) {
      rooms.push(data);
      socket.myroom = data;
      socket.broadcast.emit(
        'updatechat',
        'SERVER',
        socket.username + ' has created a new room : ' + data
      );
    }
    socket.leave(socket.room);
    socket.join(data);
    socket.emit('updatechat', 'SERVER', 'You have connected to room : ' + data);
    socket.broadcast
      .to(socket.room)
      .emit('updatechat', 'SERVER', socket.username + ' has left this room');
    socket.room = data;
    socket.broadcast
      .to(data)
      .emit('updatechat', 'SERVER', socket.username + ' has joined this room');
    io.emit('updaterooms', rooms, data);
  }

  function deleteServer(data) {
    if (socket.myroom == data) {
      for (var i = 0; i < rooms.length; i++) {
        if (rooms[i] === data) {
          rooms.splice(i, 1);
          io.emit('updaterooms', rooms);
        }
      }
      console.log(socket);
      io.to(socket.id).emit(
        'updatechat',
        'SERVER',
        ' You have deleted this room : ' + data
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
    socket.join(data);
    socket.emit('updatechat', 'SERVER', 'you have connected to room : ' + data);
    socket.broadcast
      .to(socket.room)
      .emit('updatechat', 'SERVER', socket.username + ' has left this room');
    socket.room = data;
    socket.broadcast
      .to(data)
      .emit('updatechat', 'SERVER', socket.username + ' has joined this room');
    socket.emit('updaterooms', rooms, data);
  }

  function quitServer() {
    socket.leave(socket.room);
    socket.join('General');
    socket.emit('updatechat', 'SERVER', 'You have connected to room : General');
    socket.broadcast
      .to(socket.room)
      .emit('updatechat', 'SERVER', socket.username + ' has left this room');
    socket.room = 'General';
    socket.broadcast
      .to('General')
      .emit('updatechat', 'SERVER', socket.username + ' has joined this room');
  }

  function message(expression) {
    let messageSending = expression.substr(expression.indexOf(' '));
    messageSending = messageSending.substr(1);
    let userSending = expression.substr(0, expression.indexOf(' '));
    let dest = '';          
    arr = Array.from(Object.keys(io.sockets.sockets));
    arr.forEach((element) => {
      if (element == usersIds[userSending]) {
        dest = element;
      }
    });
    console.log(dest)
    io.to(socket.id).emit(
      'updatechat',
      'SERVER',
      'Your message has been sent to '+userSending+' !'
    );
    io.to(dest).emit('updatechat', socket.username, messageSending);
  }

  function listUsers() {
    let nameString = '';
    let data = getAllUsers();
    data.forEach((element) => {
      nameString += ' ' + element;
    });
    io.to(socket.id).emit('updatechat', 'SERVER', nameString);
  }