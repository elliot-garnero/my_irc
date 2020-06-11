import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import socket from './socket';
import ActionLink from './ActionLink'
import {
  InputGroup,
  FormControl,
} from 'react-bootstrap';

export default function Channels({channel}) {
console.log(channel)
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState({name:''});
  const [chanName, setChanName] = useState({channelname:''});


useEffect(() => {
  
  socket.on('updaterooms',  (rooms,channelName ) => {
    
  (channels.includes(channelName) ? channels.includes(channelName) : channels.push(channelName))
    console.log(channels)
    console.log(channelName)
    console.log(rooms)
    
    setChannels( rooms)
   
  })
}, [channels]);

  const renderChannels = () => {console.log(channels)
    return channels.map((channelName, index) => (
      <li key={index}>
        {ActionLink(channelName)}
      </li>
    ));
  };

  const onChannelChange = (e) => {
    setChanName({ ...chanName, [e.target.name]: e.target.value });
  };
  const onNameChange = (e) => {
    setName({ ...name, [e.target.name]: e.target.value });
  };

  const onAddName = (e) => {
    e.preventDefault()
     if (name !== '') {
     socket.emit('switchName', name.name );
     setName({name:'' });
   };
 }

  const onAddChannel = (e) => {
   e.preventDefault()
    if (chanName !== '') {
        
    socket.emit('switchRoom', chanName.channelname );
    setChanName({channelname:''})
  };
}

  return (
   
    <nav id="sidebar">
      <div className="sidebar-header">
        <h3>Profil</h3>
        <ul>
          
            <li>Change username</li>
            <form onSubmit={onAddName}>
            <InputGroup className="mb-2 mt-2">
              <InputGroup.Prepend>
                <InputGroup.Text>Username :</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
              
              name={'name'}
              onChange={(e) => onNameChange(e)}
              value={name.name}
              id={'name'}
              className={'name'}
               />
            </InputGroup>
          </form>
            <li>Add a Channel</li>
          <form onSubmit={onAddChannel}>
            <InputGroup className="mb-2 mt-2">
              <InputGroup.Prepend>
                <InputGroup.Text>Channel :</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
              
              name={'channelname'}
              onChange={(e) => onChannelChange(e)}
              value={chanName.channelname}
              id={'channelname'}
              className={'channelname'}
               />
            </InputGroup>
          </form>
          
            <li>Others</li>
        
        </ul>
      </div>

      <h3>Channels</h3>
      <ul>{renderChannels()}</ul>
    </nav>


  );

}
