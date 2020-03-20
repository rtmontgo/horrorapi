import React from 'react';
import axios from 'axios';


import { BrowserRouter as Router, Route } from "react-router-dom";

import { setMovies, setUser } from '../../actions/actions';

import MoviesList from '../movies-list/movies-list';

import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

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
    //Call the superclass constructor so React can initialize it
    super();
  }

  //One of the hooks available in a React Component
  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    let user = localStorage.getItem('user')
    if (accessToken !== null) {
      this.props.setUser(user);
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData + ' authData')
    this.props.setUser(authData.user.Username);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getMovies(token) {
    axios.get('https://homeofhorror.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
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

  // onButtonClick(view) {
  //   this.setState({
  //     selectedMovie: null
  //   });
  // }

  onLogout() {
    localStorage.clear();
    window.open('/client', '_self');
    this.props.setUser(user);
  }



  render() {
    //if the state isn't initialized, this will throw on runtime
    //before the data is initially loaded
    let { movies, user } = this.props;


    //before the movies has been loaded
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

        </div>
      </Router >
    );
  }
}

let mapStateToProps = state => {
  return { movies: state.movies, user: state.user }
}

export default connect(mapStateToProps, { setMovies, setUser })(MainView);