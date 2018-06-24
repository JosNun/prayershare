import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { userIsLoggedIn } from '../../utils/utils';

export default props => (
  <Route
    path={props.path}
    render={() => {
      const shouldRedirect =
        !userIsLoggedIn() &&
        props.path !== '/signup' &&
        props.path !== '/login';

      return shouldRedirect ? <Redirect to="/login" /> : <props.component />;
    }}
  />
);
