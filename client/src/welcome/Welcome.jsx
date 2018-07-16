import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import './Welcome.css';

import PrayerCard from '../common/PrayerCard/PrayerCard';
import FriendCard from '../profile/FriendCard';

import PartnerIcon from '../assets/icons/handshake_icon.svg';

class Welcome extends Component {
  goToSignup() {
    localStorage.setItem('wasWelcomed', 'true');
    this.props.setWelcoming(false);
    this.props.history.push('/signup');
  }

  render() {
    console.log(this.props.isWelcoming);
    if (!this.props.isWelcoming) {
      return <Redirect to="/login" />;
    }
    // this.props.setWelcoming(true);
    return (
      <div className="Welcome">
        <div className="Welcome__header">
          <h1>This is PrayerShare</h1>
          <p>The anonymous prayer sharing platform</p>
        </div>

        <h3>Here’s how it works:</h3>
        <div className="Welcome__how-it-works">
          <p>Follow your friends</p>
          <FriendCard name="John Smith" avatarUrl={null} />

          <p>Partner with them in prayer</p>
          <PartnerIcon className="partner-icon" />

          <p>Share your requests</p>
          <PrayerCard>Your request here!</PrayerCard>

          <button
            onClick={this.goToSignup.bind(this)}
            className="colored full-width"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Welcome);
