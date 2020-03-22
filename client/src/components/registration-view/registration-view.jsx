import React, { useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './registration-view.scss';

export function RegistrationView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    axios.post('https://horrorapi.herokuapp.com/users', {
      Username: username,
      Password: password,
      Email: email,
      Birthdate: birthdate
    })
      .then(response => {
        const data = response.data;
        console.log(data);
        window.open('/client', '_self');
      })
      .catch(e => {
        console.log('error registering the user')
      });
  };


  return (
    <Container className='regContainer'>
      <Form className='regForm'>
        <Form.Group controlId='formUsername'>
          <Form.Label>Username</Form.Label>
          <Form.Control type="string" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Form.Group controlId='formEmail'>
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group controlId='formBirthdate'>
          <Form.Label>Birthdate</Form.Label>
          <Form.Control type="date" placeholder="MM/DD/YYYY" onChange={e => setBirthdate(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleRegister}>Submit Registration</Button>
      </Form>
    </Container>
  );
}
