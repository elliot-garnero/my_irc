import React, { useState, useEffect } from 'react';
import socket from './socket';
import 'bootstrap/dist/css/bootstrap.css';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('visitors', (newVisitors) => {
    setUsers(newVisitors);
  });
   }, [users]);
  
  const renderUsers = () => {
    return users.map(( name , index) => (
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
