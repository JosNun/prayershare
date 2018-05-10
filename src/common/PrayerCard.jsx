/* eslint-disable import/no-webpack-loader-syntax */

import React, { Component } from 'react';
import PartnerButton from './PartnerButton.jsx';
import CardMenu from './CardMenu.jsx';
import MenuDots from '-!react-svg-loader!../assets/icons/menu_dots.svg';

import './PrayerCard.css';

export class PrayerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPartnered: false,
      isMenuOpen: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
  }

  toggleMenu(e) {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  render() {
    return (
      <div className="PrayerCard">
        {this.props.children}
        <div className="PrayerCard__left-divider" />
        <div className="PrayerCard__middle-divider" />
        <div className="PrayerCard__right-divider" />
        <PartnerButton />
        <MenuDots className="PrayerCard__MenuDots" onClick={this.toggleMenu} />
        <CardMenu isOpen={this.state.isMenuOpen} handler={this.closeMenu} />
      </div>
    );
  }
}

export default PrayerCard;
