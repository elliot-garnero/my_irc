import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";



export default function Users(props) {

    const [users, setUsers] = useState([]);

    const renderUsers = () => {console.log(users)
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
