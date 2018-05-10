import React from 'react';
import './NewPrayerButton.css';

/* eslint-disable import/no-webpack-loader-syntax */
import AddIcon from '-!react-svg-loader!../assets/icons/add_icon.svg';

export default () => {
  return (
    <div className="Navbar__add-prayer-btn">
      <AddIcon />
    </div>
  );
};
