import React, { Component } from 'react';
import PrayerCard from '../common/PrayerCard';

export class Feed extends Component {
  render() {
    return (
      <div className="CardView">
        <PrayerCard>
          This is some example Prayer Card text. Hopefully it'll work.
        </PrayerCard>
      </div>
    );
  }
}

export default Feed;
