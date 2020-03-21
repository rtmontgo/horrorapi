import React from 'react';
//import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import './profile-view.scss';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
//import Card from 'react-bootstrap/Card';


class ProfileView extends React.Component {
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
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    let userEndpoint = 'https://horrorapi.herokuapp.com/users/';
    let url = `${userEndpoint}${username}`;
    axios
      .get(url, {
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
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //delete user
  deleteUser(event) {
    event.preventDefault();
    let userEndpoint = 'https://horrorapi.herokuapp.com/users/';
    let usernameLocal = localStorage.getItem('user');
    let url = `${userEndpoint}${usernameLocal}`;
    axios
      .delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        alert('Your account has been delted!');
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
    let userEndpoint = 'https://horrorapi.herokuapp.com/users/';
    let usernameLocal = localStorage.getItem('user');
    let url = `${userEndpoint}${usernameLocal}/FavoriteMovies/${favoriteMovie}`;
    axios
      .delete(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(response => {
        // update state with current movie data
        this.getUser(localStorage.getItem('token'));
      })
      .catch(event => {
        alert(event, 'Oops... something went wrong...');
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let userEndpoint = 'https://horrorapi.herokuapp.com/users/';
    let usernameLocal = localStorage.getItem('user');
    let url = `${userEndpoint}${usernameLocal}`;
    axios
      .put(
        url,
        {
          Username: this.state.usernameForm,
          Password: this.state.passwordForm,
          Email: this.state.emailForm,
          Birthdate: this.state.birthdateForm
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      )
      .then(response => {
        console.log(response);
        alert('Your data has been updated!');
        //update localStorage
        localStorage.setItem('user', this.state.usernameForm);
        // call getUser() to display changed userdata after submission
        this.getUser(localStorage.getItem('token'));
        //reset form after submitting data
        document
          .getElementsByClassName('changeDataForm')[0]
          .requestFullscreen();
      })
      .catch(event => {
        console.log(event, 'error updating the userdata');
        alert('Ooooops... Something went wrong!');
      });
  }

  toggleForm() {
    let form = document.getElementsByClassName('changeDataForm')[0];
    let toggleButton = document.getElementById('toggleButton');

    form.classList.toggle('show-form');
    if (form.classList.contains('show-form')) {
      toggleButton.innerHTML = 'CHANGE DATA &uarr;';
    } else {
      toggleButton.innerHTML = 'CHANGE DATA &darr;';
    }
  }

  render() {
    const { userData, username, email, birthdate, favoriteMovies } = this.state;
    const { movies } = this.props;

    console.log('fv', favoriteMovies);
    console.log('log m', movies);

    let filteredFavMovie = [];
    let filterMoviesByFav = movies.map(m => {
      for (let i = 0; i < favoriteMovies.length; i++) {
        const favMov = favoriteMovies[i];
        if (m._id === favMov) {
          filteredFavMovie.push(m);
        }
      }
    });
    console.log(
      'TCL: ProfileView -> render -> filteredFavMovie',
      filteredFavMovie
    );

    if (!userData) return null;

    return (
      <div className="view">
        <div className="profile-view">
          <h2 className="director">User Profile</h2>
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
            {movies && filteredFavMovie ? (
              <div className="value">
                {filteredFavMovie.map(favoriteMovie => (
                  <div key={favoriteMovie._id}>
                    {favoriteMovie.Title}
                    <span
                      onClick={event =>
                        this.deleteMovie(event, favoriteMovie._id)
                      }
                    >
                      {' '}
                      Delete
                  </span>
                  </div>
                ))}
              </div>
            ) : (
                <div className="value">No favorites yet</div>
              )}
          </div>

          <Link to={'/'}>
            <Button className="view-btn" variant="outline-dark" type="button">
              Back
          </Button>
          </Link>
          <Button
            className="view-btn"
            variant="outline-dark"
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
                type="text"
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

export default ProfileView;