import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import './login-view.scss';
import '../registration-view/registration-view';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    //Send request to server for auth
    axios.post('https://horrorapi.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        console.log(username, password);
        const data = response.data;
        console.log(data);
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('no such user')
      });
  };

  return (
    <Container className='login-view'>
      <h2>Login</h2>
      <Form>
        <Form.Group controlId='formUsername'>
          <Form.Label>Username: </Form.Label>
          <Form.Control size='sm' type='text' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} /></Form.Group>
        <Form.Group controlId='formPassword'>
          <Form.Label>Password: </Form.Label>
          <Form.Control size='sm' type="password" placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant='primary' onClick={handleSubmit}>Submit</Button>
        <Form.Group controlId='newUser'>
          <Form.Text>New User? <Link to={`/register`}><Button id='registerButton' variant='link'> Register Now </Button></Link>
          </Form.Text>
        </Form.Group>
      </Form>
    </Container>
  );
}

LoginView.propTypes = {
  onLoggedIn: PropTypes.func.isRequired,
  // onClick: PropTypes.func.isRequired
};