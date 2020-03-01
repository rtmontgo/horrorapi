import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import { connect } from 'react-redux';
import { setMovies, setUser } from './actions/actions';

import { Route, Switch } from 'react-router-dom';
// import { Router } from "react-router";
import { BrowserRouter as Router } from 'react-router-dom';
// import { createBrowserHistory } from "history";
// const history = createBrowserHistory(); 

// imports for files to bundle
import './index.scss';

// import bootstrap components
import Container from 'react-bootstrap/Container';

// import app components
import MainView from './components/main-view/main-view';
import { LoginView } from './components/login-view/login-view';
import { RegistrationView } from './components/registration-view/registration-view';
import { MovieView } from './components/movie-view/movie-view';
import { GenreView } from './components/genre-view/genre-view';
import { DirectorView } from './components/director-view/director-view';
import { ProfileView } from './components/profile-view/profile-view';


const DefaultLayout = ({ component: Component }) => {
  return (
    <Container className="mt-5">
      <Component />
    </Container>
  );
};

const DefaultLayoutRoute = ({ component: Component }) => {
  return (
    <Route render={matchProps => (
      <DefaultLayout component={Component} {...matchProps} />
    )} />
  )
};

// main component
class App extends React.Component {

  constructor() {
    // super class constructor
    super();

    // init an empty state
    this.state = {
      token: null
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      let userProfileString = localStorage.getItem('user-profile');
      let userProfile = JSON.parse(userProfileString);
      this.setState({
        token: accessToken
      });
      this.props.setUser(userProfile);
    }
    this.getMovies(accessToken);
  }
  getMovies(token) {
    const url_root = 'https://horrorapi.herokuapp.com'
    const movies_url = `${url_root}/movies`;
    let options = {}
    if (token) {
      options = {
        headers: { Authorization: `Bearer ${token}` }
      }
    }
    axios.get(movies_url, options)
      .then(res => {
        // update the state
        this.props.setMovies(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }

  onLoggedIn(authData) {
    let userProfile = null;
    let token = null;
    if (authData) {
      userProfile = authData.user;
      token = authData.token;
    }

    this.props.setUser(userProfile);
    this.setState({
      token
    });

    if (userProfile) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user-profile', JSON.stringify(authData.user));
      this.getMovies(authData.token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user-profile');
    }

    window.open('/client', '_self');
  }

  onUserUpdate(userProfile, goHome = true) {
    if (userProfile) {
      localStorage.setItem('user-profile', JSON.stringify(userProfile));
      this.props.setUser(userProfile);
      if (goHome) {
        window.open('/client', '_self'); // the second argument '_self' is necessary so that the page will open in the current tab
      }
    }
  }

  onToggleFavourite(movieId) {
    const { userProfile } = this.props;
    const { token } = this.state;
    if (!token) {
      // if token is not present, user is not logged in, go home
      console.log('user is not logged in');
      window.open('/client', '_self'); // the second argument '_self' is necessary so that the page will open in the current tab
      return;
    }

    const username = userProfile.Username;

    console.log('toggle favorite movie', movieId, 'for user', username);

    //const url_root = 'http://localhost:3000'
    const url_root = 'https://horrorapi.herokuapp.com'
    const favorite_movie_url = `${url_root}/users/${username}/${movieId}`;

    let options = {
      headers: { Authorization: `Bearer ${token}` }
    };
    let axiosAction = (url, options) => axios.post(url, null, options);

    // deep copy of the user profile (used to preview the change)
    const newTempUserProfile = JSON.parse(JSON.stringify(userProfile));

    let favoriteMovieIndex = userProfile.FavoriteMovies.indexOf(movieId);
    if (favoriteMovieIndex === -1) {
      console.log('add to favorites.');
      // update the change for faster feedback
      // add to the temporary profile
      newTempUserProfile.FavoriteMovies.push(movieId);
    } else {
      axiosAction = axios.delete;
      console.log('remove from favorites.');
      // update the change for faster feedback
      // remove it to the temporary profile
      newTempUserProfile.FavoriteMovies.splice(favoriteMovieIndex, 1);
    }

    // update the change for faster feedback
    this.onUserUpdate(newTempUserProfile, false);

    axiosAction(favorite_movie_url, options)
      .then(response => {
        const newUserProfile = response.data;
        // consolidate the change
        this.onUserUpdate(newUserProfile, false);
      })
      .catch(e => {
        console.log('error toggling the movie as favorite:', e)
        // revert the change
        this.onUserUpdate(userProfile, false);
      });
  }

  render() {
    const { movies, userProfile } = this.props;
    const { token } = this.state;

    // the log in / log out function
    const onLoggedIn = authData => this.onLoggedIn(authData);
    // toggle star/unstar function
    const onToggleFavourite = movieId => this.onToggleFavourite(movieId);

    // these are propagated through all the routes
    const routeProps = { token, onLoggedIn, userProfile, onToggleFavourite };

    // if movies are not yet loaded, return a spinner
    if (!movies) {
      return (<DefaultLayout component={MainView} onLoggedIn={onLoggedIn} onToggleFavourite={onToggleFavourite} />);
    }

    return (
      <Router basename="/client">
        <div className="navigation">
          <Link to={`/users/${localStorage.getItem('userProfile')}`}>
            <Button className="profile" variant='outline-info'>Profile</Button>
          </Link></div>
        <Switch>
          <Route
            path="/movies/:movieId"
            render={(matchProps) => <DefaultLayout {...matchProps} {...routeProps}
              component={MovieView}
              movie={movies.find(m => m._id === matchProps.match.params.movieId)}
            />} />
          <DefaultLayoutRoute
            path="/login" component={LoginView} {...routeProps} />
          <DefaultLayoutRoute
            path="/register" component={RegistrationView} {...routeProps} />
          <DefaultLayoutRoute
            exact path="/" component={MainView} {...routeProps} movies={movies} />
          <Route
            path="/genres/:name"
            render={(matchProps) => <DefaultLayout {...matchProps} {...routeProps} component={GenreView} genre={movies.find(m => m.Genre.Name === matchProps.match.params.genreName).Genre} movies={movies.filter(m => m.Genre.Name === matchProps.match.params.genreName)} />} />
          <Route
            path="/directors/:name"
            render={(matchProps) => <DefaultLayout {...matchProps} {...routeProps} component={DirectorView} director={movies.find(m => m.Director.Name === matchProps.match.params.directorName).Director} movies={movies.filter(m => m.Director.Name === matchProps.match.params.directorName)} />} />
          <Route path="/users/:username" render={(matchProps) => <DefaultLayout {...matchProps} {...routeProps} component={ProfileView} userProfile={userProfile} movies={movies.filter(m => userProfile && userProfile.FavoriteMovies.includes(m._id))} onUserUpdate={userProfile => this.onUserUpdate(userProfile)} />} />
        </Switch>
      </Router>
    );
  }
}

let mapStateToProps = state => {
  return {
    movies: state.movies,
    userProfile: state.userProfile
  };
}

export default connect(mapStateToProps, { setMovies, setUser })(App);

DefaultLayout.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};

DefaultLayoutRoute.propTypes = {
  onLoggedIn: PropTypes.func.isRequired
};