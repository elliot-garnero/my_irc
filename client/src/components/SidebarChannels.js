import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";




export default function Channels(props) {
    
    const [channels, setChannels] = useState(['general','video_games','cars']);
    const [currentChannel, SetCurrentChannel] = useState()
    
    const onChannelChange = (channel) => {
        
        // SetCurrentChannel(currentChannel,  channel );
        // socket.emit('enter', { name: 'chris', currentChannel });
        
    };

    const renderChannels = () => {
        return channels.map(({ channelName, proprio, adress }, index) => (
            <li key={index}>
                <a href={adress}>{channelName}</a>
            </li>
            
        ));
    };


    return (
              
        <nav id="sidebar">
        <div className="sidebar-header">
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

        <ul>
            <h3>Channels</h3>
            {renderChannels()}
            <li key="0">
                <a href="" onClick={onChannelChange('video games')}>Video Games</a>
            </li>
            <li key="1">
                <a href="cars">Cars</a>
            </li>
        </ul>
        </nav>
              
    );
  
}
