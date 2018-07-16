import React from 'react';
import { withRouter } from 'react-router-dom';
import './NewPrayerButton.css';

/* eslint-disable import/no-webpack-loader-syntax */
import AddIcon from '../assets/icons/add_icon.svg';

const NewPrayerButton = withRouter(props => {
  const createPost = () => {
    props.history.push('/feed/create-post');
  };

  return (
    <div className="Navbar__add-prayer-btn" onClick={createPost}>
      <AddIcon />
    </div>
  );
});

export default NewPrayerButton;
