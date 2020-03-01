import React, { Component } from 'react';
import { createStore } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';
import { Provider } from 'react-redux';

import MainView from './components/main-view/main-view';


import moviesApp from './reducers/reducers';

// Import statement to indicate that you need to bundle `./index.scss`
import './index.scss';

const store = createStore(moviesApp, devToolsEnhancer({ realtime: true }));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

export default App;