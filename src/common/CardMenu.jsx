import React, { Component } from 'react';
import './CardMenu.css';

class CardMenu extends Component {
  render() {
    return (
      <div>
        <div
          className={this.props.isOpen ? 'CardMenu open' : 'CardMenu'}
          data-popup="true"
        >
          <div className="CardMenu__option">Hide Post</div>
          <div className="CardMenu__option CardMenu__option--caution">
            Unfollow Poster
          </div>
        </div>
        <div className="CardMenu__backdrop" onClick={this.props.handler} />
      </div>
    );
  }
}

export default CardMenu;
