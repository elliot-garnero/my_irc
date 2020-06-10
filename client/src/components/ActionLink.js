import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import socket from './socket';
import { Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

export default function ActionLink(channel) {

    

    const handleClick = (e) => {
      e.preventDefault();
      console.log(channel)

    socket.emit('switchRoom', channel );
    
    };
  
      return (
        <Button onClick={handleClick.bind(this)} variant="link">
          {channel}
        </Button>
      );
  }