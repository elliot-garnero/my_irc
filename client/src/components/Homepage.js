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
  });
  const [chat, setChat] = useState([]);

  

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit('message', { name, message });
    setState({ message: '', name });
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

  const userstyle = {
    height:'50px'
};

  return (
    <Container fluid>
      <Row>
      <Header />
      <Col md={2} className={"alert alert-info"} style={sidestyle}>
        <Channels />
      </Col>
      <Col md={8} className={"alert alert-dark"} style={mainstyle}>
        <Chat />
      </Col>
      <Col md={2} className={"alert alert-info"} style={sidestyle}>
      <Users />
      </Col>
    
      <Col md={12}>
      <form onSubmit={onMessageSubmit}>
        <Form.Row  role="form">
                <Col md={2}>
                    <InputGroup  className="mb-2">
                        <InputGroup.Prepend>
                            <InputGroup.Text>@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl value={state.name} />
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
      {/* <h2>Welcome {state.name}</h2>
      <div className="card">
        <form onSubmit={onMessageSubmit}>
          <h1>Message</h1>
          <div>
            <TextField
              name="message"
              onChange={(e) => onTextChange(e)}
              value={state.message}
              id="outlined-multiline-static"
              variant="outlined"
              label="Message"
            />
          </div>
          <button>Send</button>
        </form>
        <div className="render-chat">
          <h1>Chat</h1>
          {renderChat()}
        </div>
      </div> */}
    </Container>
  );
}
