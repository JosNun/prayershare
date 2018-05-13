import React, { Component } from 'react';

import PrayerCard from '../common/PrayerCard/PrayerCard';

export default class Feed extends Component {
  constructor(props) {
    super(props);

    const dummyData = [
      {
        id: 21321,
        content: 'This is some example Prayer Card text. Hopefully it’ll work.',
      },
      {
        id: 82374,
        content:
          'This is another card. If you see this, and everything looks fine, that means things are being rendered properly :)',
      },
    ];

    this.state = {
      cards: [...dummyData],
    };
  }

  cardsList() {
    const cards = this.state.cards.map(el => (
      <PrayerCard key={el.id}>{el.content}</PrayerCard>
    ));

    return cards;
  }

  render() {
    return <div className="MainView">{this.cardsList()}</div>;
  }
}
