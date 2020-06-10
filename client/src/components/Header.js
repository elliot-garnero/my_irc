import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Row } from 'react-bootstrap';

export default function Header({name, channel}) {
  


  const mystyle = {
    width: '100%',
    height: '100px',
    justifyContent: 'center',
  };

  return (
    <Row style={mystyle}>
      <h2>Welcome {name}</h2>
    </Row>
  );
  
}
