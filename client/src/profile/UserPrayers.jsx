import React from 'react';

import UserPrayerCard from '../common/PrayerCard/UserPrayerCard';

export default () => (
  <div className="Profile-Card-Container">
    <UserPrayerCard partnersAmount="13" isUsers>
      Here’s a user’s prayer card. This should render differently than a
      standard one.
    </UserPrayerCard>
  </div>
);
