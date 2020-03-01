import React from 'react';
import axios from 'axios';
import MovieView from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import DirectorView from '../director-view/director-view';
import ProfileView from '../profile-view/profile-view';
import GenreView from '../genre-view/genre-view';
import { RegistrationView } from '../registration-view/registration-view';
import Container from 'react-bootstrap/Container';

import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './main-view.scss';
import { connect } from 'react-redux';

import MoviesList from '../movies-list/movies-list';

import { setMovies, setLoggedInUser } from '../../actions/actions';

export class MainView extends React.Component {
  constructor() {
    //Call the superclass constructor
    // so React can initialize it
    super();

    // Iitialize the state to an empty object so we can destructure it later
    this.state = {
      movies: [],
      user: null,
      profileData: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user'),
        profileData: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
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
        this.props.setLoggedInUser(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
      profileData: authData.user
    });
    this.props.setLoggedInUser(authData.user);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios
      .get('horrorapi.herokuapp.com/movies', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        // Assign the result to the state
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onSignedIn(user) {
    this.setState({
      user: user
    });
  }

  logOut() {
    //Clears Storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('movies');

    //resets user state to render again
    this.setState({
      user: null
    });
  }

  //This overrides the render() method of the superclass
  //No need to call super() though, as it does nothing by default
  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { user } = this.state;

    return (
      <Router>
        <header className="header">
          <Link to={'/'}>
            <div alt="clap" className="logohme"></div>
          </Link>
          <p className="logo" id="hide">
            Welcome to the Dreary Database
          </p>
          <div className="nav">
            {user && (
              <div>
                <input className="menu-btn" type="checkbox" id="menu-btn" />
                <label className="menu-icon" htmlFor="menu-btn">
                  <span className="navicon"></span>
                </label>
                <ul className="menu">
                  <li>
                    <Link to={'/profile'}>
                      <Button id="profilebtn" variant="outline-dark">
                        Profile
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Button
                      id="logoutbtn"
                      variant="outline-dark"
                      onClick={() => this.logOut()}
                    >
                      {' '}
                      LogOut
                    </Button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <Container className="main-view">
          <Row>
            <Route
              exact
              path="/"
              render={() => {
                if (!user)
                  return (
                    <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
                  );
                return <MoviesList />;
              }}
            />
            <Route
              path="/movies/:movieId"
              render={({ match }) => (
                <MovieView movieId={match.params.movieId} />
              )}
            />

            <Route
              path="/register"
              render={() => (
                <RegistrationView onSignedIn={user => this.onSignedIn(user)} />
              )}
            />

            <Route
              exact
              path="/genre/:name"
              render={({ match }) => (
                <GenreView genreName={match.params.name} />
              )}
            />

            <Route
              exact
              path="/director/:name"
              render={({ match }) => (
                <DirectorView directorName={match.params.name} />
              )}
            />

            <Route exact path="/users/:Username" render={() => <ProfileView />} />
          </Row>
        </Container>
      </Router>
    );
  }
}
export default connect(
  null,
  { setMovies, setLoggedInUser }
)(MainView);