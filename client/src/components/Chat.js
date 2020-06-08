import React, { useState, useEffect } from 'react';
import socket from './socket';
import 'bootstrap/dist/css/bootstrap.css';

export default function Header(props) {
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState([]);

  useEffect(() => {
    socket.on('message', ({ name, message, channel, date, action }) => {
      if (action === 'enter') {
        setRoom([...room, { name, channel, date, action }]);
      } else if (action === 'quit') {
        setRoom([...room, { name, channel, date, action }]);
      } else {
        setChat([...chat, { name, message, channel, date }]);
      }
    });
  });

  const renderRoom = () => {
    return room.map(({ name, channel, date, action }, index) => (
      <li key={index} className="enter">
        <i>
          <kbd className="bg-success">{name}</kbd> just {action} the {channel}{' '}
          channel on {date}
        </i>
      </li>
    ));
  };

  const renderChat = () => {
    if (chat) {
      return chat.map(({ name, channel, message, date }, index) => (
        <li key={index}>
          <b className="text-uppercase">{name} </b>
          <span className="text-muted font-weight-light date">{date}</span>{' '}
          <div>{message}</div>(info dev : sur room -> {channel} )
        </li>
      ));
    }
  };

  return (
    <ul>
      {renderRoom()}
      {renderChat()}
    </ul>
  );
}
