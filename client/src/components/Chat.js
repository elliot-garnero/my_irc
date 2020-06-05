import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";

const socket = io.connect('http://localhost:4000');

export default function Header(props) {
 
    const [chat, setChat] = useState([]);

    useEffect(() => {
        socket.on('message', ({ name, message }) => {
          setChat([...chat, { name, message }]);
        });
      });

    const renderChat = () => {
        return chat.map(({ name, message }, index) => (
            <li key={index}>
                <b>{name}:</b> <div>{message}</div>
            </li>
        ));
    };


    return (
            
        <ul class="list-unstyled components">
            <h3>Messages</h3>
            {renderChat()}
                                
        </ul>   
    );
}

