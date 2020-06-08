const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  let today = new Date()
  var options = { month: 'long'};
  let month = new Intl.DateTimeFormat('en-US', options).format(today);
  let date = today.getFullYear()+'/'+month+'/'+today.getDate()+' at '+ today.getHours() + "H" + today.getMinutes();
  socket.on('message', ({ name, channel, message, action }) => {
    if(action =='enter'){
      io.emit('message', { name, channel, date, action})
    }
    else if(message !== ''){
      io.emit('message', { name, channel, message, date });
    }
    
  });
 
  socket.on ( 'deconnexion' , () => {
    io.emit('message', { name, channel, date, action : 'quit' })
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
