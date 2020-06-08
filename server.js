const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('user connected');
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

  // The socket (user) returns new User
  socket.on('newUser', (user) => {
    console.log('New user :', user);
    socket.user = user;
    emitVisitors();
  });

  // The socket (user) returns User new message
  socket.on('message', ({ name, channel, message, action }) => {
    if (action == 'enter') {
      io.emit('message', { name, channel, date, action });
    } else if (message !== '') {
      io.emit('message', { name, channel, message, date });
    }
  });

  // The socket (user) DC
  socket.on('disconnect', () => {
    emitVisitors();
    console.log('user disconected');
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
