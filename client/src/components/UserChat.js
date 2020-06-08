import React, { useState, useEffect, useLocation } from 'react';
import io from 'socket.io-client';
import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Col, InputGroup,FormControl, Row, Container } from 'react-bootstrap';

const socket = io.connect('http://localhost:4000');

export default function UserChat(props) {
 
    const [state, setState] = useState({
        message: '',
        name: props.location.state.userName,
    });

    const [chat, setChat] = useState([]);

    useEffect(() => {
    socket.on('message', ({ name, message }) => {
        setChat([...chat, { name, message }]);
        });
    });
    
    const onTextChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const onMessageSubmit = (e) => {
        e.preventDefault();
        const { name, message } = state;
        socket.emit('message', { name, message });
        setState({ message: '', name });
      };

    return (
        <Form onSubmit={onMessageSubmit}>
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
                        onChange={e => onTextChange(e)}
                        value={state.message}
                        id="message"
                        className="message"
                    />
                </InputGroup>
            </Col>

            <Col md={2}>
                <Button type="submit">Envoyer</Button>
            </Col>
        </Form> 
    );
}

