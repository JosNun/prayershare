import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default props => (
  <Route
    path={props.path}
    render={() => {
      const isAuthed =
        localStorage.getItem('token') && localStorage.getItem('userId');
      const shouldRedirect =
        !isAuthed && props.path !== '/signup' && props.path !== '/login';

      return shouldRedirect ? <Redirect to="/login" /> : <props.component />;
    }}
  />
);
