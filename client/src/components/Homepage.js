import React, { useState, useEffect } from 'react';
import Channels from './SidebarChannels';
import Header from './Header';
import Users from './SidebarUsers';
import Chat from './Chat';
import socket from './socket';
import {
  Button,
  Form,
  Col,
  InputGroup,
  FormControl,
  Row,
  Container,
} from 'react-bootstrap';

export default function Homepage(props) {
  const [state, setState] = useState({
    message: '',
    name: props.location.state.userName,
    channel: props.location.state.channel
      ? props.location.state.channel
      : 'general',
  });
  const [chat, setChat] = useState([]);

   useEffect(() => {
    socket.on('updatename', (newname) => {
      setState({ name: newname });
    })
   }, []);

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e) => {
    e.preventDefault();
    if (state.message !== '') {
      const { name, message, channel } = state;
      socket.emit('sendchat', message);
      setState({ message: '', name, channel });
    } else {
    }
  };

  const mainstyle = {
    marginTop: 0,
    width: '100%',
    height: '800px',
    justifyContent: 'center',
    wordWrap: 'break-word',
  };

  const sidestyle = {
    height: '800px',
  };

  
  return (
    <Container fluid>
      <Row>
        <Header channel={state.channel} name={state.name}/>
        <Col md={2} className={'component'} style={sidestyle}>
        <Channels channel={state.channel} name={state.name} />
        </Col>
        <Col md={8} className={'component'} style={mainstyle}>
          <Chat />
        </Col>
        <Col md={2} className={'component'} style={sidestyle}>
          <Users />
        </Col>

        <Col md={12} className={'component'}>
          <form onSubmit={onMessageSubmit}>
            <Form.Row role="form">
              <Col md={2}>
                <InputGroup className="mb-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>@</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl placeholder={state.name} />
                </InputGroup>
              </Col>

              <Col md={8}>
                <InputGroup className="mb-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Message :</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    name={'message'}
                    onChange={(e) => onTextChange(e)}
                    value={state.message}
                    id={'message'}
                    className={'message'}
                  />
                </InputGroup>
              </Col>

              <Col md={2}>
                <Button className={'btn btn-warning btn-block'} type="submit">
                  Envoyer
                </Button>
              </Col>
            </Form.Row>
          </form>
        </Col>
      </Row>
    </Container>
  );
}
