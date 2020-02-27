import { combineReducers } from 'redux';

import { SET_FILTER, SET_MOVIES, SET_LOGGEDIN } from '../actions/actions';

function visibilityFilter(state = '', action) {
  switch (action.type) {
    case SET_FILTER:
      return action.value;
    default:
      return state;
  }
}

function loggedInUser(state = [], action) {
  switch (action.type) {
    case SET_LOGGEDIN:
      return action.value
    default:
      return state;
  }
}

function movies(state = [], action) {
  switch (action.type) {
    case SET_MOVIES:
      return action.value;
    default:
      return state;
  }
}

const moviesApp = combineReducers({
  visibilityFilter,
  loggedInUser,
  movies
});


export default moviesApp;