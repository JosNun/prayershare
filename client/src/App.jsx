/*
  // TODO: Avatars
  // TODO: Google Login
  // TODO: Unfollow Prayer card owner
  TODO: Hide prayer card
  TODO: Loading animations
  TODO: Email confirmation on signup
  TODO: Cache user posts
  TODO: Password reset
  TODO: Fix visual bug when unfollowing user
  TODO: Fix logout bug
  TODO: Facebook Login
  TODO: Facebook friend search
  TODO: Profile editing
  TODO: Load more on scroll
  TODO: Clear cache on logout
  TODO: Remove partnerships for unfriended people
  TODO: Animate ALL THE THINGS!
  TODO: Unfollow confirmation dialog
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

const client = new ApolloClient({
  uri: 'https://localhost:3000/graphql',
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
    };

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
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
      window.gapi.load('auth2');
    });
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div>
            <Switch>
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />

              <Redirect exact path="/" to="/feed" />
              <AuthRoute path="/feed" component={Feed} />
              <AuthRoute path="/partnered" component={PartneredFeed} />
              <AuthRoute path="/about" component={About} />
              <AuthRoute path="/profile" component={Profile} />
            </Switch>
            <AppMenu
              isMenuOpen={this.state.isMenuOpen}
              closeHandler={this.closeMenu}
            />
            <Navbar
              menuClickHandler={this.toggleMenu}
              isMenuOpen={this.state.isMenuOpen}
            />
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}
