import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Feed from './feed/Feed';
import About from './about/About';
import Profile from './profile/Profile';
import AppMenu from './common/AppMenu';
import Navbar from './common/Navbar';

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
    this.state.isMenuOpen ? this.closeMenu() : this.openMenu();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
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
    );
  }
}
