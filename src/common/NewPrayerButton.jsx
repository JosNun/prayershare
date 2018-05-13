import React from 'react';
import './NewPrayerButton.css';

/* eslint-disable import/no-webpack-loader-syntax */
import AddIcon from '-!react-svg-loader!../assets/icons/add_icon.svg';

const NewPrayerButton = () => (
  <div className="Navbar__add-prayer-btn">
    <AddIcon />
  </div>
);

export default NewPrayerButton;
