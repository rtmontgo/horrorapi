import React from 'react';
//import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import './profile-view.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
//import Card from 'react-bootstrap/Card';

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {
      username: null,
      password: null,
      email: null,
      birthdate: null,
      userData: null,
      favoriteMovies: [],
      usernameForm: null,
      passwordForm: null,
      emailForm: null,
      birthdateForm: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(localStorage.getItem('user'), accessToken);
    }
  }

  getUser(user, token) {
    axios.get(`https://horrorapi.herokuapp.com/users/${user}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          userData: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthdate: response.data.Birthdate,
          favoriteMovies: response.data.FavoriteMovies
        })
        console.log(this.state.favoriteMovies);
        console.log(this.props.movies);
      })
      .catch(error => {
        console.error(error);
      });
  }

  //delete user
  deleteUser(event) {
    event.preventDefault();
    axios
      .delete(`https://horrorapi.herokuapp.com/update/${localStorage.getItem('user')}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        console.log('user deleted')
        alert('Your account has been deleted!');
        //clears your storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        //opens login view
        window.open('/', '_self');
      })
      .catch(event => {
        alert(event, 'failed to delete user');
      });
  }

  deleteMovie(event, favoriteMovie) {
    event.preventDefault();
    console.log(favoriteMovie);
    axios
      .delete(`https://horrorapi.herokuapp.com/users/${localStorage.getItem('user')}/movies/${favoriteMovie}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        // update state with current movie data
        this.getUser(localStorage.getItem('user'), localStorage.getItem('token'));
      })
      .catch(event => {
        alert(event, 'something went wrong...');
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  // update user handler

  handleSubmit(event) {
    event.preventDefault();

    axios
      .put(`https://horrorapi.herokuapp.com/update/${localStorage.getItem('user')}`,

        {
          Username: this.state.usernameForm,
          Password: this.state.passwordForm,
          Email: this.state.emailForm,
          Birthday: this.state.birthdayForm
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      .then(response => {
        alert('Your data has been updated!');
        localStorage.setItem('user', this.state.usernameForm);
        // call getUser() 
        this.getUser(localStorage.getItem('user'), localStorage.getItem('token'));
        //Reset Form
        document.getElementsByClassName('changeDataForm')[0].reset();
      })
      .catch(event => {

        alert('Something went wrong!');
      });
  }

  render() {
    const { userData, username, email, birthdate, favoriteMovies } = this.state;
    const { movies } = this.props;
    const favoriteMoviesList = movies.filter(movie => this.state.favoriteMovies.includes(movie._id));
    if (!userData) return null;

    return (
      <div className="view">
        <div className="profile-view">
          <h2 className="title">User Profile</h2>
          <hr></hr>
          <div className="username">
            <h4 className="label">Name:</h4>
            <div className="value">{username}</div>
          </div>
          <div className="password">
            <h4 className="label">Password:</h4>
            <div className="value">********</div>
          </div>
          <div className="birthday">
            <h4 className="label">Birthdate:</h4>
            <div className="value">{birthdate}</div>
          </div>
          <div className="email">
            <h4 className="label">Email:</h4>
            <div className="value">{email}</div>
          </div>

          <div className="favorite-movies">
            <h4 id="fav" className="label">Favorite Movies:</h4>
            {
              favoriteMovies ? favoriteMoviesList.map(movie => (
                <div>
                  <p key={movie._id}>
                    {movie.Title}
                  </p>
                  <Button variant='danger' size='sm' onClick={e => this.deleteMovie(e, movie._id)}>Remove </Button>
                </div>
              )) : <p>No favorites yet.</p>
            }

          </div>

          <Link to={'/'}>
            <Button className="view-btn" variant="outline-info" type="button">
              Back
          </Button>
          </Link>
          <Button
            className="view-btn"
            variant="danger"
            type="button"
            onClick={event => this.deleteUser(event)}
          >
            Delete Account
        </Button>


          <Form className="changeDataForm">
            <h2>Edit Profile Data</h2>
            <hr></hr>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Your Username</Form.Label>
              <Form.Control
                type="text"
                name="usernameForm"
                onChange={event => this.handleChange(event)}
                placeholder="Enter Username"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Your Password</Form.Label>
              <Form.Control
                type="password"
                name="passwordForm"
                onChange={event => this.handleChange(event)}
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Your Email</Form.Label>
              <Form.Control
                type="text"
                name="emailForm"
                onChange={event => this.handleChange(event)}
                placeholder="example@email.com"
              />
            </Form.Group>

            <Form.Group controlId="formBasicBirthday">
              <Form.Label>Your Birthday</Form.Label>
              <Form.Control
                type="text"
                name="birthdayForm"
                onChange={event => this.handleChange(event)}
                placeholder="example: 01/01/1990"
              />
            </Form.Group>

            <Button
              className="change-btn"
              variant="outline-dark"
              type="button"
              onClick={event => this.handleSubmit(event)}
            >
              Change
          </Button>
          </Form>
        </div>
      </div>
    );
  }
}

