const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// usernames which are currently connected to the chat
var usernames = {};
var usersIds = [];
// rooms which are currently available in chat
var rooms = ['General', 'Video games', 'Dev', 'Music', 'Computers'];

io.on('connection', (socket) => {
  // Set date
  let today = new Date();
  function goodMinutes() {
    return today.getMinutes() < 10 ? '0' : '';
  }
  let date = today.getHours() + 'H' + goodMinutes() + today.getMinutes();

  // Create a new user
  socket.on('newUser', (user) => {
    console.log('new :', user);
    socket.username = user;
    socket.room = 'General';
    usersIds[user]= socket.id
    usernames[user] = user;
    socket.join('General');
    socket.emit(
      'updatechat',
      'SERVER',
      'You have connected to General channel',
      date,
      socket.room
    );
    socket.broadcast
      .to('General')
      .emit('updatechat', 'SERVER', user + ' has connected to this room');
    socket.emit('updaterooms', rooms, 'General');
    console.log(socket.username);
    emitVisitors();
  });
  //change or create room
  socket.on('switchRoom', function (newroom) {
    //if room does'nt exist, create room
    if (!rooms.includes(newroom)) {
      rooms.push(newroom);
      socket.myroom = newroom;
      socket.broadcast.emit(
        'updatechat',
        'SERVER',
        socket.username + ' has created a new room : ' + newroom
      );
    }
    socket.leave(socket.room);
    socket.join(newroom);
    socket.emit(
      'updatechat',
      'SERVER',
      'You have connected to room : ' + newroom
    );
    socket.broadcast
      .to(socket.room)
      .emit('updatechat', 'SERVER', socket.username + ' has left this room');
    socket.room = newroom;
    socket.broadcast
      .to(newroom)
      .emit('updatechat', 'SERVER', socket.username + ' has joined this room');
    io.emit('updaterooms', rooms, newroom);
  });

  socket.on('switchName', function (name) {
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
        'Your username has been changed'
      );
      socket.emit('updatename', name);
      emitVisitors();
    } else {
      io.to(socket.id).emit(
        'updatechat',
        'SERVER',
        'This username already exists, please choose another one'
      );
    }
  });

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

  // when the client emits 'sendchat', this listens and executes
  socket.on('sendchat', function (data) {
    if (data[0] == '/') {
      let command = data.substr(0, data.indexOf(' '));
      let expression = data.substr(data.indexOf(' '));
      command = command.substr(1);
      expression = expression.substr(1);
      switch (command) {
        case 'nick':
          name(expression);
          break;
        case 'list':
          listServer(expression);
          break;
        case 'create':
          createServer(expression);
          break;
        case 'delete':
          deleteServer(expression);
          break;
        case 'join':
          joinServer(expression);
          break;
        case 'part':
          quitServer();
          break;
        case 'users':
          listUsers();
          break;
        case 'msg':
          message(expression);
          break;
        default:
          io.sockets
            .in(socket.room)
            .emit('updatechat', socket.username, data, date);
          break;
      }
    } else {
      io.sockets
        .in(socket.room)
        .emit('updatechat', socket.username, data, date);
    }
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    delete usernames[socket.username];
    emitVisitors();
    // update list of users in chat, client-side
    io.sockets.emit('updateusers', usernames);
    // echo globally that this client has left
    socket.broadcast.emit(
      'updatechat',
      'SERVER',
      socket.username + ' has disconnected'
    );
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

http.listen(4000, function () {
  console.log('Server running on port 4000');
});
