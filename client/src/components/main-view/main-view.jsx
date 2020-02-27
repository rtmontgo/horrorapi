import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route } from "react-router-dom";

import { setMovies, setLoggedInUser } from '../../actions/actions';

import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

import MoviesList from '../movies-list/movies-list';
import { ProfileView } from '../profile-view/profile-view';
import { ProfileUpdate } from '../profile-view/profile-update';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import { MovieView } from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view';
import './main-view.scss';

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      user: null
    };
  }
  // One of the "hooks" available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  getMovies(token) {
    axios.get('https://horrorapi.herokuapp.com/movies', {
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

  onLoggedIn(authData) {
    this.setState({
      user: authData.user.Username
    });

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getUser(token) {
    axios
      .get('https://homeofhorror.herokuapp.com/users/', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        this.props.setLoggedUser(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  onButtonClick() {
    this.setState({
      selectedMovie: null
    });
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({
      user: null
    })
    window.open('/client', '_self');
  }

  render() {

    let { movies } = this.props;
    let { user } = this.state;

    return (
      <Router basename="/client">
        <div className="navigation">
          <Link to={`/users/${localStorage.getItem('user')}`}>
            <Button className="profile" variant='outline-info'>Profile</Button>
          </Link>

          <Button className="logout" variant='outline-info' onClick={() => this.onLogout()} >Log Out</Button>
        </div >

        <div className="main-view">
          <Route exact path="/" render={() => {
            if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
            return <MoviesList movies={movies} />;
          }
          } />

          <Route path="/register" render={() => <RegistrationView />}
          />

          <Route path="/movies/:movieId" render={({ match }) => <MovieView movie={movies.find(m => m._id === match.params.movieId)} />} />

          <Route
            path='/directors/:name'
            render={({ match }) => {
              if (!movies) return <div className='main-view' />;
              return <DirectorView
                director={
                  movies.find(m => m.Director.Name === match.params.name).Director}
              />
            }}
          />
          <Route
            path='/genres/:name'
            render={({ match }) => {
              if (!movies || !movies.length) return <div className="main-view" />;
              return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
            }
            }
          />

          <Route path="/users/:Username" render={({ match }) => { return <ProfileView movies={movies} /> }
          } />

          <Route path="/update/:Username" render={() => <ProfileUpdate />
          }
          />

        </div>
      </Router >
    );
  }
}

let mapStateToProps = state => {
  return { movies: state.movies }
}

export default connect(mapStateToProps, { setMovies, setLoggedInUser })(MainView);

MainView.propTypes = {

  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string,
      ImageUrl: PropTypes.string,
      Description: PropTypes.string,
      Genre: PropTypes.exact({
        _id: PropTypes.string,
        Name: PropTypes.string,
        Description: PropTypes.string
      }),
      Director: PropTypes.shape({
        Name: PropTypes.string
      })
    })
  ),
  onToggleFavourite: PropTypes.func.isRequired
};