import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import Channels from './SidebarChannels'
import Header from './Header'
import Users from './SidebarUsers'
import Chat from './Chat'


import { Button, Form, Col, InputGroup,FormControl, Text, Row, Container } from 'react-bootstrap';

const socket = io.connect('http://localhost:4000');

export default function Homepage(props) {
  const [state, setState] = useState({
    message: '',
    name: props.location.state.userName,
    channel: props.location.state.channel
  });
  

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { name, message, channel } = state;
    socket.emit('message', { name, message, channel });
    setState({ message: '', name , channel});
  };

  const mainstyle = {
    marginTop: 0,
    width:'100%',
    height: '800px',
    justifyContent: 'center'
  };

  const sidestyle = {
    height:'800px'
  }; 


  return (
    <Container fluid>
      <Row>
      <Header />
      <Col md={2} className={"component"} style={sidestyle}>
        <Channels />
      </Col>
      <Col md={8} className={"component"} style={mainstyle}>
        <Chat />
      </Col>
      <Col md={2} className={"component"} style={sidestyle}>
      <Users />
      </Col>
    
      <Col md={12} className={"component"}>
      <form onSubmit={onMessageSubmit}>
        <Form.Row  role="form">
                <Col md={2}>
                    <InputGroup  className="mb-2">
                        <InputGroup.Prepend>
                            <InputGroup.Text>@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder={state.name} />
                    </InputGroup>
                </Col>

                <Col md={8}>
                    <InputGroup  className="mb-2">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Message :</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            name={"message"}
                            onChange={e => onTextChange(e)}
                            value={state.message}
                            id={"message"}
                            className={"message"}
                        />
                    </InputGroup>
                </Col>

                <Col md={2}>
                  
                    <Button className={"btn btn-info btn-block"} type="submit">Envoyer</Button>
                </Col>
            </Form.Row> 
            </form>
        </Col>
    </Row>
    </Container>
  );
}
