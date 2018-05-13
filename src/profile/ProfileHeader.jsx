/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './ProfileHeader.css';

import PrayingHands from '-!react-svg-loader!../assets/icons/praying_hands_icon.svg';

import PersonIcon from '-!react-svg-loader!../assets/icons/person_icon.svg';

export default withRouter((props) => (
  <div className="ProfileHeader">
    <div className="ProfileHeader__user-info">
      <div className="ProfileHeader__profile-photo">
        <img src="https://scontent.fpap1-1.fna.fbcdn.net/v/t1.0-1/p320x320/28795827_2092538017736253_5661042761877422080_n.jpg?_nc_cat=0&oh=702aa6b49c1b7e7e120d4d80680a01fb&oe=5B8E8996" />
        {/* Dummy profile photo atm */}
      </div>
      <h2 className="ProfileHeader__profile-name">Josiah</h2>
    </div>

    <div className="ProfileHeader__pagination">
      <Link to="/profile" className={"ProfileHeader__page-indicator ProfileHeader__page-indicator--prayers " + (props.location.pathname === '/profile' ? "active" : "")}>
        <PrayingHands />
        <span>Prayers</span>
      </Link>
      <Link to="/profile/friends" className={"ProfileHeader__page-indicator ProfileHeader__page-indicator--friends " + (props.location.pathname === '/profile/friends' ? "active" : "")}>
        <PersonIcon />
        <span>Friends</span>
      </Link>
    </div>
  </div>
));
