import React, { Component } from 'react';

import { UserContext } from '../App';

import PrayerCard from '../common/PrayerCard/PrayerCard';

export default class Feed extends Component {
  constructor(props) {
    super(props);

    const dummyData = [
      {
        id: 21321,
        content: 'This is some example Prayer Card text. Hopefully it’ll work.',
        ownerId: 2146,
      },
      {
        id: 21641,
        content:
          "This is a prayer card owned by the dummy user. You shouldn't see this in the feed",
        ownerId: 32100,
      },
      {
        id: 82374,
        content:
          'This is another card. If you see this, and everything looks fine, that means things are being rendered properly :)',
        ownerId: 432,
      },
    ];

    this.state = {
      cards: [...dummyData],
    };
  }

  cardsList(id) {
    const cards = this.state.cards.map(
      el =>
        id !== el.ownerId ? (
          <PrayerCard key={el.id}>{el.content}</PrayerCard>
        ) : (
          ''
        )
    );

    return cards;
  }

  render() {
    return (
      <UserContext.Consumer>
        {userId => <div className="MainView">{this.cardsList(userId)}</div>}
      </UserContext.Consumer>
    );
  }
}
