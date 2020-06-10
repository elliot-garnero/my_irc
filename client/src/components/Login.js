import React from 'react';
import { Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Form, InputGroup, Container } from 'react-bootstrap';
import socket from './socket';

export default class LoginPage extends React.Component {
  state = {
    name: '',
    errorMessage: '',
    
  };

  onLoginSubmit = (e) => {
    e.preventDefault();
    let { name } = this.state;
    if (name !== '') {
      socket.emit('newUser', name); 
      socket.emit('message', { name, action: 'enter' });
      this.setState({ redirectHome: true });
    } else {
      this.setState({ errorMessage: 'Please enter a username' });
    }
  };

  onTextChange = (e) => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  render() {
    const redirectHome = this.state.redirectHome;
    if (redirectHome) {
      return (
        <Redirect
          to={{
            pathname: '/Home',
            state: {
              userName: this.state.name,
              
            },
          }}
        />
      );
    }

    const mystyle = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    };

    return (
      <Container fluid>
        <div className="alert alert-info">
          <h1 className={'text-center mt-4'}>Welcome to our IRC</h1>
        </div>
        <form className={'form'} style={mystyle} onSubmit={this.onLoginSubmit}>
          <InputGroup className="mb-2 mt-4">
            <InputGroup.Prepend>
              <InputGroup.Text>Choose a username :</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              name={'name'}
              onChange={(e) => this.onTextChange(e)}
              value={this.state.name}
              id="login"
              className="w-25"
            />
          </InputGroup>
          <Button className="mt-4" type="submit">
            Enter
          </Button>
          {this.state.name.length < 1 && <h3>{this.state.errorMessage}</h3>}
        </form>
      </Container>
    );
  }
}
