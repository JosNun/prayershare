import React, { Component } from 'react';

import './AppMenu.css';

class AppMenu extends Component {
  render() {
    return (
      <div>
        <div className={this.props.isMenuOpen ? 'AppMenu open' : 'AppMenu'} />
        <div className="AppMenu__backdrop" onClick={this.props.closeHandler} />
      </div>
    );
  }
}

export default AppMenu;
