import { combineReducers } from 'redux';

import {
  SET_FILTER,
  SET_MOVIES,
  SET_LOGGEDIN_USER,
  SET_FAVORITES
} from '../actions/actions';

function visibilityFilter(state = '', action) {
  switch (action.type) {
    case SET_FILTER:
      return action.value;
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

function favorites(state = [], action) {
  switch (action.type) {
    case SET_FAVORITES:
      return action.value;
    default:
      return state;
  }
}

function loggedInUser(state = [], action) {
  switch (action.type) {
    case SET_LOGGEDIN_USER:
      return action.value;
    default:
      return state;
  }
}

const moviesApp = combineReducers({
  visibilityFilter,
  movies,
  loggedInUser,
  favorites
});

export default moviesApp;