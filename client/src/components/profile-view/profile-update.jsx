import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './profile-view.scss'

export function ProfileUpdate(props) {
  const {
    Username: oldUsername,
    Password: oldPassword,
    Email: oldEmail,
    Birthdate: oldBirthdate
  } = props.userInfo;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    setUsername(oldUsername);
    setPassword(oldPassword);
    setEmail(oldEmail);
    setBirthdate(oldBirthdate);
  }, [oldUsername, oldPassword, oldEmail, oldBirthdate]);

  const user = props.user;

  const handleUpdate = e => {
    e.preventDefault();
    const userInfo = {
      Username: username,
      Password: password,
      Email: email,
      Birthdate: birthdate
    };
    axios
      .put(`https://homeofhorror.herokuapp.com/users/${localStorage.getItem('user')}`,
        userInfo,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        },
      )
      .then(response => {
        props.updateUser(userInfo);
        alert('Profile updated successfully');
        window.open('/', '_self');
      })
      .catch(e => {
        const errors = e.response.data.errors || [];
        let errorMessage = '';
        errors.forEach(err => {
          errorMessage += err.msg;
        });
        alert(`Something went wrong: ${errorMessage}`)
        console.log(`Error updating the user info.`);
      });
  }

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(`https://homeofhorror.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => {
        alert('Your account has been deleted');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.open('/', '_self');
      })
      .catch(e => {
        alert('Error deleting the account');
      });
  }

  return (
    <Form className="update-form">
      <div className="text-center">
        <p className="update-title">Update user information</p>
      </div>
      <Form.Group controlId="formNewUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      </Form.Group>
      <Form.Group controlId='formBirthdate'>
        <Form.Label>Birthdate</Form.Label>
        <Form.Control type='date' placeholder='MM/DD/YYYY' value={birthdate} onChange={e => setBirthdate(e.target.value)} />
      </Form.Group>
      <div className="text-center">
        <Button className="btn-register" variant="secondary" type="submit" onClick={handleUpdate} >
          Save updates</Button>
        <Button className="btn-delete" variant="danger" type="submit" onClick={handleDelete} >
          Delete profile
      </Button>
      </div>
    </Form>
  );
}