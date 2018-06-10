import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import './ProfileHeader.css';

import PrayingHands from '../assets/icons/praying_hands_icon.svg';

import PersonIcon from '../assets/icons/person_icon.svg';

export default withRouter(props => {
  const GET_USER_INFO = gql`
    query user($userId: ID!) {
      user(id: $userId) {
        firstName
        profilePhoto
      }
    }
  `;

  return (
    <div className="ProfileHeader">
      <Query query={GET_USER_INFO} variables={{ userId: 'dXNlcnM6Njg=' }}>
        {({ loading, error, data }) => {
          if (loading) return <h2>Loading...</h2>;
          if (error) return <h2>Error has occured :(</h2>;
          return (
            <div className="ProfileHeader__user-info">
              <div className="ProfileHeader__profile-photo">
                <img
                  src={data.profilePhoto || '/images/icons/avatar.png'}
                  alt="profile"
                />
                {/* Dummy profile photo atm */}
              </div>
              <h2 className="ProfileHeader__profile-name">
                {data.user.firstName}
              </h2>
            </div>
          );
        }}
      </Query>

      <div className="ProfileHeader__pagination">
        <Link
          to="/profile"
          className={`ProfileHeader__page-indicator ProfileHeader__page-indicator--prayers ${
            props.location.pathname === '/profile' ? 'active' : ''
          }`}
        >
          <PrayingHands />
          <span>Prayers</span>
        </Link>
        <Link
          to="/profile/friends"
          className={`ProfileHeader__page-indicator ProfileHeader__page-indicator--friends ${
            props.location.pathname === '/profile/friends' ? 'active' : ''
          }`}
        >
          <PersonIcon />
          <span>Friends</span>
        </Link>
      </div>
    </div>
  );
});
