import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import socket from './socket';
import ActionLink from './ActionLink'
import {
  InputGroup,
  FormControl,
} from 'react-bootstrap';

export default function Channels({channel}) {

   const [channels, setChannels] = useState([]);

  const [currentChannel, SetCurrentChannel] = useState();
  const [name, setName] = useState({name:''});
  const [chanName, setChanName] = useState({name:''});


useEffect(() => {
  
  socket.on('updaterooms',  (rooms,channelName ) => {
  (rooms.includes(channelName) ? rooms.includes(channelName) : rooms.push(channelName))
    console.log(rooms)
    console.log(channelName)
    setChannels( rooms)
   
  })
}, [channels]);

  const renderChannels = () => {
    return channels.map((channelName, index) => (
      <li key={index}>
        {ActionLink(channelName)}
      </li>
    ));
  };

  const onChanChange = (e) => {
    setChanName({ ...chanName, [e.target.name]: e.target.value });
  };
  const onTextChange = (e) => {
    setName({ ...name, [e.target.name]: e.target.value });
  };

  const onChangeName = (e) => {
    e.preventDefault()
     if (chanName !== '') {
   
     socket.emit('switchName', chanName.name );
   };
 }

  const onAddChannel = (e) => {
   e.preventDefault()
    if (name !== '') {
     console.log(name);    
    socket.emit('switchRoom', name.name );
  };
}

  return (
   
    <nav id="sidebar">
      <div className="sidebar-header">
        <h3>Profil</h3>
        <ul>
          
            <li>Change username</li>
            <form onSubmit={onChangeName}>
            <InputGroup className="mb-2 mt-2">
              <InputGroup.Prepend>
                <InputGroup.Text>Username :</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
              
              name={'name'}
              onChange={(e) => onChanChange(e)}
              value={chanName.name}
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
              
              name={'name'}
              onChange={(e) => onTextChange(e)}
              value={name.name}
              id={'name'}
              className={'name'}
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
