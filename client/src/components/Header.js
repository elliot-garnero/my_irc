import React from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Col, InputGroup,FormControl, Row, Container } from 'react-bootstrap';

const socket = io.connect('http://localhost:4000');

export default class Header extends React.Component {
  state = {
    name: '',
    errorMessage: '',
  };

  render() {
  

    const mystyle = {
      width:'100%',
      height: '100px',
      justifyContent: 'center'
    };

    return (
        
        <Row className={"alert alert-warning"} style={mystyle}>
            <h1>Header</h1>
        </Row>
       
    );
  }
}
