import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";

const socket = io.connect('http://localhost:4000');

export default function Users(props) {

    const [users, setUsers] = useState([]);

    const renderUsers = () => {
        return users.map(({ usersName }, index) => (
            <li key={index}>
                <span>{usersName}</span>
            </li>  
        ));
    };


    const mystyle = {
        height:'800px'
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
