import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import ProfileHeader from './ProfileHeader';
import UserPrayers from './UserPrayers';
import UserFriends from './UserFriends';

import './Profile.css';

class Profile extends Component {
  render() {
    return (
      <div>
        <ProfileHeader />
        <Switch>
          <Route exact path="/profile" component={UserPrayers} />
          <Route path="/profile/friends" component={UserFriends} />
        </Switch>
      </div>
    );
  }
}

export default Profile;
