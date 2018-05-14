import React from 'react';
import PropTypes from 'prop-types';

import UnfollowButton from './UnfollowButton';

const FriendCard = props => (
  <div className="FriendCard">
    <div
      className={`FriendCard__avatar ${
        props.avatarUrl === `${process.env.PUBLIC_URL}/images/icons/avatar.png`
          ? 'unset'
          : ''
      }`}
    >
      <img src={props.avatarUrl} alt="avatar" />
    </div>
    <div className="FriendCard__name">{props.name}</div>
    <UnfollowButton unfollowHandler={props.unfollowHandler} />
  </div>
);

FriendCard.propTypes = {
  avatarUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  unfollowHandler: PropTypes.func.isRequired,
};

FriendCard.defaultProps = {
  avatarUrl: `${process.env.PUBLIC_URL}/images/icons/avatar.png`,
};

export default FriendCard;
