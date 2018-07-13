/*
  // TODO: Avatars
  // TODO: Google Login
  // TODO: Unfollow Prayer card owner
  // TODO: Hide prayer card
  // TODO: Email confirmation on signup
  // TODO: Redirect to account creation confirmation after signup
  // TODO: Password reset
  // TODO: Display errors to client (login)
  // TODO: Only show logout if logged in
  // TODO: Remove partnerships for unfriended people
  // TODO: Fix logout bug
  TODO: Revise about text
  TODO: Contact page
  TODO: Privacy policy / TOS
  TODO: Redirect to login on invalid JWT
  TODO: Load more on scroll
  TODO: Loading animations
  TODO: Fix visual bug when unfollowing user
  TODO: Analytics
  TODO: Button animations
  TODO: Profile editing
  TODO: Cache user posts
  TODO: Facebook Login
  TODO: Facebook friend search
  TODO: Select which profile to use
  TODO: Invite friends button
  TODO: Clear cache on logout
  TODO: Animate ALL THE THINGS!
  TODO: Offline support
  TODO: Unfollow confirmation dialog
  
  
  TODO: Move JWT to cookies (Maybe)
*/

import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';

import AuthRoute from './common/utils/AuthRoute';

import Feed from './feed/Feed';
import PartneredFeed from './partnered/PartneredFeed';
import About from './about/About';
import Profile from './profile/Profile';
import AppMenu from './common/AppMenu';
import Navbar from './common/Navbar';
import Signup from './login/Signup';
import Login from './login/Login';
import ForgotPassword from './reset/ForgotPassword';
import ResetPassword from './reset/ResetPassword';
import Welcome from './welcome/Welcome';

const client = new ApolloClient({
  // uri: process.env.GRAPHQL_ENDPOINT,
  request: async operation => {
    const token = await localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    });
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      isWelcoming: !localStorage.getItem('wasWelcomed'),
    };

    this.setWelcoming = this.setWelcoming.bind(this);

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  setWelcoming(val) {
    val
      ? localStorage.removeItem('wasWelcomed')
      : localStorage.setItem('wasWelcomed', true);
    this.setState({
      isWelcoming: val,
    });
  }

  openMenu() {
    this.setState({
      isMenuOpen: true,
    });
  }

  closeMenu() {
    this.setState({
      isMenuOpen: false,
    });
  }

  toggleMenu() {
    if (this.state.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      try {
        window.gapi.load('auth2');
      } catch (err) {
        console.log('Google login unavailable');
        console.warn(err);
      }
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="Routed-container">
            <Route
              path="*"
              render={props =>
                this.state.isWelcoming &&
                window.location.pathname.split('/')[1] !== 'welcome' && (
                  <Redirect to="/welcome" />
                )
              }
            />
            <Switch>
              <Route
                path="/welcome"
                render={props => (
                  <Welcome
                    isWelcoming={this.state.isWelcoming}
                    setWelcoming={this.setWelcoming}
                  />
                )}
              />
              <Redirect exact path="/" to="/welcome" />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/about" component={About} />

              <AuthRoute path="/feed" component={Feed} />
              <AuthRoute path="/partnered" component={PartneredFeed} />
              <AuthRoute path="/profile" component={Profile} />
              <Route path="/forgot" component={ForgotPassword} />
              <Route path="/password-reset/:hash" component={ResetPassword} />
            </Switch>
            {!this.state.isWelcoming && (
              <React.Fragment>
                <AppMenu
                  isMenuOpen={this.state.isMenuOpen}
                  closeHandler={this.closeMenu}
                />
                <Navbar
                  menuClickHandler={this.toggleMenu}
                  isMenuOpen={this.state.isMenuOpen}
                />
              </React.Fragment>
            )}
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}
