/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';

import SearchIcon from '../assets/icons/search_icon.svg';

export default props => {
  let searchBox;
  const handleChange = e => {
    if (searchBox.value === '') {
      props.showFriends();
    }
  };
  return (
    <form
      className="FriendSearchCard"
      onSubmit={e => {
        e.preventDefault();
        if (searchBox.value !== '') {
          props.performSearch(props.client, searchBox.value);
        }
      }}
    >
      <input
        type="text"
        placeholder="Find Friends"
        ref={node => {
          searchBox = node;
        }}
        onChange={handleChange}
      />
      <SearchIcon />
    </form>
  );
};
