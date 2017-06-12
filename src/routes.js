import React from 'react';
import {
  Router,
  Route,
  hashHistory,
  browserHistory,
  IndexRoute,
} from 'react-router';

import App from './components/publisher/App';

/* global SERVER_RENDING */
const routes = (
  <Router history={SERVER_RENDING ? browserHistory : hashHistory}>
    <Route path="/" component={App}>
    </Route>
  </Router>
);

export default routes;
