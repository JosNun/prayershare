/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

import NewPrayer from './NewPrayerButton.jsx';

import PrayerFeedIcon from '-!react-svg-loader!../assets/icons/prayer_feed_icon.svg';
import PartneredIcon from '-!react-svg-loader!../assets/icons/handshake_icon.svg';
import PersonIcon from '-!react-svg-loader!../assets/icons/person_icon.svg';
import HamburgerIcon from '-!react-svg-loader!../assets/icons/hamburger_icon.svg';

const Navbar = props => (
  <div className="Navbar">
    <NavLink to="/feed" activeClassName="active">
      <PrayerFeedIcon className="Navbar__button" />
    </NavLink>
    <NavLink to="/partnered" activeClassName="active">
      <PartneredIcon className="Navbar__button Navbar__partnered-button" />
    </NavLink>
    <NewPrayer />
    <NavLink to="/person" activeClassName="active">
      <PersonIcon className="Navbar__button" />
    </NavLink>
    <HamburgerIcon
      className={props.isMenuOpen ? 'Navbar__button active' : 'Navbar__button'}
      onClick={props.menuClickHandler}
    />
  </div>
);

export default Navbar;
