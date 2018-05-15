import React, { Component } from 'react';
import { BrowserRouter, Switch, Redirect, Route } from 'react-router-dom';

import Feed from './feed/Feed';
import About from './about/About';
import Profile from './profile/Profile';
import AppMenu from './common/AppMenu';
import Navbar from './common/Navbar';

export const UserContext = React.createContext('user');

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      userId: null,
    };

    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    this.login();
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
    this.state.isMenuOpen ? this.closeMenu() : this.openMenu();
  }

  login() {
    this.setState({
      userId: 32100,
    });
  }

  render() {
    return (
      <UserContext.Provider value={this.state.userId}>
        <BrowserRouter>
          <div>
            <Switch>
              <Redirect exact path="/" to="/feed" />
              <Route path="/feed" component={Feed} />
              <Route path="/about" component={About} />
              <Route path="/profile" component={Profile} />
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
      </UserContext.Provider>
    );
  }
}
