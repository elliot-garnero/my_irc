import React, { useState, useEffect } from 'react';
import socket from './socket';
import 'bootstrap/dist/css/bootstrap.css';

export default function Header(props) {
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState([]);
  
  

  useEffect(() => {
    socket.on('updatechat',( name, message, date ) => {     
      setChat((chat) => [...chat, { name, message, date}]);
    })
  }, [room]); 
console.log(chat)
  

  const renderChat = () => {
    
      return chat.map(({ name, message, date}, index) => (
        <li key={index}>
          
          Message from <b className="bg-success">{name} </b>
          <span className="text-muted font-weight-light date">{date} : </span>
          <span>{message}</span>
        </li>
      ));
    
  };

  return (
    <div id="chat">
    <ul>
      {renderChat()}
    </ul>
    </div>
  );
}
