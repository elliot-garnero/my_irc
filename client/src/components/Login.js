import React from 'react';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, InputGroup, Container } from 'react-bootstrap';

const socket = io.connect('http://localhost:4000');

export default class LoginPage extends React.Component {
  state = {
    name: '',
    errorMessage: '',
    channel:'general',
    
  };

  onLoginSubmit = (e) => {
    e.preventDefault();
    let { name } = this.state;
    let { channel } = this.state;
    if (name !== '') {
      socket.emit('message', { name, channel, action : 'enter' });      
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
      //   props.history.push('/home', { userName: this.state.name });
      return (
        <Redirect
          to={{
            pathname: '/Home',
            userName: this.state.name,
            state: { userName: this.state.name, channel: this.state.channel },
          }}
          userName={this.state.name}
        />
      );
    }

    const mystyle = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center'
    };

    return (

      <Container fluid>
        <div className = "alert alert-info">
          <h1 className={"text-center mt-4"}>Welcome to our IRC</h1>
        </div> 
        <form className={"form"} style={mystyle} onSubmit={this.onLoginSubmit}>
        
            <InputGroup  className="mb-2 mt-4">
              <InputGroup.Prepend>
                  <InputGroup.Text>Choose a username :</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                name={"name"}
                onChange={(e) => this.onTextChange(e)}
                value={this.state.name}
                id="login"
                className="w-25"
              /> 
              </InputGroup>
            <Button className="mt-4" type="submit" >Enter</Button>
            {this.state.name.length < 1 && <h3>{this.state.errorMessage}</h3>}
        
        </form> 
      </Container>
      // <div className="card">
      //   <form onSubmit={this.onLoginSubmit}>
      //     <h1>Welcome to our IRC</h1>
      //     <div className="name-field">
      //       <TextField
      //         name="name"
      //         onChange={(e) => this.onTextChange(e)}
      //         value={this.state.name}
      //         label="Choose a username"
      //       />
      //     </div>
      //     <button>Enter</button>
      //     {this.state.name.length < 1 && <h3>{this.state.errorMessage}</h3>}
      //   </form>
      // </div>
    );
  }
}
