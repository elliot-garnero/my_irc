import React, { useState } from 'react';
import socket from './socket';
import 'bootstrap/dist/css/bootstrap.css';

export default function Users(props) {
  const [users, setUsers] = useState([]);

  socket.on('visitors', (newVisitors) => {
    setUsers(newVisitors);
  });

  const renderUsers = () => {
    return users.map(({ name }, index) => (
      <li key={index}>
        <span>{name}</span>
      </li>
    ));
  };

  return (
    <nav id="sidebar">
      <ul>
        <h3>Users</h3>
        {renderUsers()}
      </ul>
    </nav>
  );
}
