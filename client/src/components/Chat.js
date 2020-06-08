import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";

const socket = io.connect('http://localhost:4000');

export default function Header(props) {
 
    const [chat, setChat] = useState([]);
    const [room, setRoom] = useState([])
    
    socket.on('enter', ({ name, channel, date }) => {
        setRoom([...room, { name, channel, date }]);
        });

    useEffect(() => {
        socket.on('message', ({ name, message, channel }) => {
            setChat([...chat, { name, message, channel }]);
            });
        
      });

    const renderRoom = () => {
        return room.map(({ name, channel, date }, index) => (
            <li key={index}>
                <i><kbd className="bg-success">{name}</kbd>  just entered the <b>{channel}</b> room on  {date}</i> 
            </li>
        )); 
    };
    
    const renderChat = () => {
        if(chat){
            return chat.map(({ name, message, channel }, index) => (
                <li key={index}>
                    <b>{name} : </b> <div>{message}</div>sur room -> {channel}
                </li>
            ));
        }
        if(room){
            return room.map(({ name, channel }) => (
                <li>
                    <i><kbd className="bg-success">{name}</kbd> just enter in <b>{channel}</b> room</i> 
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

