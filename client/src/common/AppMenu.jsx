import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import EditIcon from '../assets/icons/edit_icon.svg';
import AboutIcon from '../assets/icons/about_icon.svg';
import './AppMenu.css';
import { userIsLoggedIn } from '../utils/utils';

const AppMenu = withRouter(props => {
  const logout = async () => {
    console.log('Logging out');

    const auth2 = await window.gapi.auth2.getAuthInstance();
    if (auth2) {
      auth2.signOut().then(() => {
        console.log('user signed out');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        props.history.push('/login');
      });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      props.history.push('/login');
    }
  };

  return (
    <div>
      <div className={props.isMenuOpen ? 'AppMenu open' : 'AppMenu'}>
        {userIsLoggedIn() && (
          <Link to="/profile/edit" className="AppMenu__option">
            Edit Profile
            <EditIcon />
          </Link>
        )}

        <Link to="/about" className="AppMenu__option">
          About PrayerShare
          <AboutIcon />
        </Link>
        {userIsLoggedIn() && (
          <div
            className="AppMenu__option AppMenu__option--red"
            onClick={logout}
          >
            Log Out
          </div>
        )}
      </div>
      <div
        className="AppMenu__backdrop"
        onClick={props.closeHandler}
        role="menuitem"
        tabIndex="0"
      />
    </div>
  );
});

AppMenu.propTypes = {
  isMenuOpen: PropTypes.bool,
  closeHandler: PropTypes.func.isRequired,
};

AppMenu.defaultProps = {
  isMenuOpen: false,
};

export default AppMenu;
