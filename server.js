const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  socket.on('message', ({ name, message, channel }) => {
    if(message !== ''){
      io.emit('message', { name, message, channel });
    }
  });
  socket.on('enter', ({ name, channel }) => {
    let today = new Date()
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' at '+ today.getHours() + " H " + today.getMinutes();
    io.emit('enter', { name, channel, date })
  });
});

// Broadcast to everyone when user connects
// socket.emit();

// Broadcast to everyone but User when user connects
// socket.broadcast.emit('message', '*user* has joined the chat');

// Runs when user disconnects
// socket.on('disconnect', () => {
//   io.emit('message', '*user* has left the chat');
// })

http.listen(4000, function () {
  console.log('Server running on port 4000');
});
