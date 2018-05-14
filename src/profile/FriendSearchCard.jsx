/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';

import SearchIcon from '-!react-svg-loader!../assets/icons/search_icon.svg';

export default () => (
  <div className="FriendSearchCard">
    <input type="text" placeholder="Find Friends" />
    <SearchIcon />
  </div>
);
