import React from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

import ProfileView from '../profile-view/profile-view';
import { ProfileUpdate } from '../profile-view/profile-update';
import { LoginView } from '../login-view/login-view';
import { RegistrationView } from '../registration-view/registration-view';
import MovieView from '../movie-view/movie-view';
import DirectorView from '../director-view/director-view';
import GenreView from '../genre-view/genre-view';
import './main-view.scss';

export class MainView extends React.Component {

  constructor() {
    super();

    this.state = {
      movies: null,
      selectedMovie: null,
      user: null
    };
  }
  // One of the "hooks" available in a React Component
  componentDidMount() {
    axios.get('<my-api-endpoint/movies>')
      .then(response => {
        // Assign the result to the state
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies, selectedMovie, user } = this.state;

    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;
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