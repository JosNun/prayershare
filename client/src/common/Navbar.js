import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Navbar.css';

import NewPrayer from './NewPrayerButton';

import PrayerFeedIcon from '../assets/icons/prayer_feed_icon.svg';
import PartneredIcon from '../assets/icons/handshake_icon.svg';
import PersonIcon from '../assets/icons/person_icon.svg';
import HamburgerIcon from '../assets/icons/hamburger_icon.svg';

const Navbar = props => (
  <div className="Navbar">
    <NavLink to="/feed" activeClassName="active">
      <PrayerFeedIcon className="Navbar__button" />
    </NavLink>
    <NavLink to="/partnered" activeClassName="active">
      <PartneredIcon className="Navbar__button Navbar__partnered-button" />
    </NavLink>
    <NewPrayer />
    <NavLink to="/profile" activeClassName="active">
      <PersonIcon className="Navbar__button" />
    </NavLink>
    <HamburgerIcon
      className={props.isMenuOpen ? 'Navbar__button active' : 'Navbar__button'}
      onClick={props.menuClickHandler}
    />
  </div>
);

Navbar.propTypes = {
  isMenuOpen: PropTypes.bool,
  menuClickHandler: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  isMenuOpen: false,
};

export default Navbar;
