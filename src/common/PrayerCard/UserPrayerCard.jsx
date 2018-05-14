/* eslint-disable import/no-webpack-loader-syntax */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PartnerButton from './PartnerButton';

import OwnCardMenu from './OwnCardMenu';
import MenuDots from '-!react-svg-loader!../../assets/icons/menu_dots.svg';

import './PrayerCard.css';

export default class UserPrayerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPartnered: false,
      isMenuOpen: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.deletePrayer = this.deletePrayer.bind(this);
  }

  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  deletePrayer() {
    console.log(`Deleting Card`);
  }

  render() {
    return (
      <div className="PrayerCard UserPrayerCard">
        {this.props.children}
        <div className="PrayerCard__left-divider" />
        <div className="PrayerCard__middle-divider" />
        <div className="PrayerCard__right-divider" />
        <PartnerButton
          isPartnered={this.state.isPartnered}
          clickHandler={this.togglePartner}
          partneredAmount={this.props.partnersAmount}
        />
        <MenuDots className="PrayerCard__MenuDots" onClick={this.toggleMenu} />
        <OwnCardMenu
          isOpen={this.state.isMenuOpen}
          closeHandler={this.closeMenu}
          deleteHandler={this.deletePrayer}
        />
      </div>
    );
  }
}

UserPrayerCard.propTypes = {
  children: PropTypes.string,
  partnersAmount: PropTypes.string,
};

UserPrayerCard.defaultProps = {
  children: '',
  partnersAmount: null,
};
