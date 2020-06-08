import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Row } from 'react-bootstrap';

export default class Header extends React.Component {
  state = {
    name: '',
    errorMessage: '',
  };

  render() {
    const mystyle = {
      width: '100%',
      height: '100px',
      justifyContent: 'center',
    };

    return (
      <Row style={mystyle}>
        <h1>IRC</h1>
      </Row>
    );
  }
}
