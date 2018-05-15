/* eslint-disable import/no-webpack-loader-syntax */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PartnerButton from './PartnerButton';
import CardMenu from './CardMenu';

import MenuDots from '../../assets/icons/menu_dots.svg';

import './PrayerCard.css';

export default class PrayerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPartnered: false,
      isMenuOpen: false,
    };

    this.togglePartner = this.togglePartner.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.hidePrayer = this.hidePrayer.bind(this);
    this.unfollowPoster = this.unfollowPoster.bind(this);
  }

  togglePartner() {
    const wasPartnered = this.state.isPartnered;
    this.setState({
      isPartnered: !wasPartnered,
    });
  }

  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  hidePrayer() {
    console.log(`Hiding Card`);
  }

  unfollowPoster() {
    console.log(`Unfollowing poster`);
  }

  render() {
    return (
      <div className="PrayerCard">
        {this.props.children}
        <div className="PrayerCard__left-divider" />
        <div className="PrayerCard__middle-divider" />
        <div className="PrayerCard__right-divider" />
        <PartnerButton
          isPartnered={this.state.isPartnered}
          clickHandler={this.togglePartner}
        />
        <MenuDots className="PrayerCard__MenuDots" onClick={this.toggleMenu} />
        <CardMenu
          isOpen={this.state.isMenuOpen}
          closeHandler={this.closeMenu}
          hideHandler={this.hidePrayer}
          unfollowHandler={this.unfollowPoster}
        />
      </div>
    );
  }
}

PrayerCard.propTypes = {
  children: PropTypes.string,
};

PrayerCard.defaultProps = {
  children: '',
  isUsers: false,
};
