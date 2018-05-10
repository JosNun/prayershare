import React from 'react';
import { Route } from 'react-router-dom';

let HashRoute = ({ component: Component, path, ...routeProps }) => (
  <Route
    {...routeProps}
    component={({ location, ...props }) =>
      location.hash === path && <Component {...props} />
    }
  />
);

export default HashRoute;
