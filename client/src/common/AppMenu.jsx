import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import EditIcon from '../assets/icons/edit_icon.svg';
import AboutIcon from '../assets/icons/about_icon.svg';
import './AppMenu.css';

const AppMenu = props => (
  <div>
    <div className={props.isMenuOpen ? 'AppMenu open' : 'AppMenu'}>
      <Link to="/profile/edit" className="AppMenu__option">
        Edit Profile
        <EditIcon />
      </Link>
      <Link to="/about" className="AppMenu__option">
        About PrayerShare
        <AboutIcon />
      </Link>
    </div>
    <div
      className="AppMenu__backdrop"
      onClick={props.closeHandler}
      role="menuitem"
      tabIndex="0"
    />
  </div>
);

AppMenu.propTypes = {
  isMenuOpen: PropTypes.bool,
  closeHandler: PropTypes.func.isRequired,
};

AppMenu.defaultProps = {
  isMenuOpen: false,
};

export default AppMenu;
