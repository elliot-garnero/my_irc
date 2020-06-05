import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";




const socket = io.connect('http://localhost:4000');

export default function Channels(props) {

    const [channels, setChannels] = useState([]);

    const renderChannels = () => {
        return channels.map(({ channelName, proprio, adress }, index) => (
            <li key={index}>
                <a href={adress}>{channelName}</a>
            </li>
            
        ));
        };

    return (
              
        <nav id="sidebar">
        <div class="sidebar-header">
            <h3>Profil</h3>
            <ul>
        
                <li>
                    <a href="#">Change username</a>
                </li>
                <li>
                    <a href="#">Create Channel</a>
                </li>
                <li>
                    <a href="#">Others</a>
                </li>
            
            </ul>
        </div>

        <ul class="list-unstyled components">
            <h3>Channels</h3>
            {renderChannels()}
            
        </ul>
        </nav>
              
    );
  
}
