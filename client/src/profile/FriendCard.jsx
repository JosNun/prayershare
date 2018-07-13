import React from 'react';
import PropTypes from 'prop-types';

const FriendCard = props => (
  <div className="FriendCard">
    <div
      className={`FriendCard__avatar ${
        props.avatarUrl === null ? 'unset' : ''
      }`}
    >
      <img
        src={
          props.avatarUrl || `${process.env.PUBLIC_URL}/images/icons/avatar.png`
        }
        alt="avatar"
      />
    </div>
    <div className="FriendCard__name">{props.name}</div>
    {props.isFriend ? (
      <div
        className="FriendCard__unfollow-button"
        onClick={props.unfollowHandler}
      >
        Unfollow
      </div>
    ) : (
      <div
        className="FriendCard__follow-button"
        onClick={props.addFriendHandler}
      >
        Follow
      </div>
    )}
  </div>
);

FriendCard.propTypes = {
  avatarUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  unfollowHandler: PropTypes.func,
};

FriendCard.defaultProps = {
  avatarUrl: `${process.env.PUBLIC_URL}/images/icons/avatar.png`,
};

export default FriendCard;
