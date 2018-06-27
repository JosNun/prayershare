import React, { Component } from 'react';
import PrayerCard from '../common/PrayerCard/PrayerCard';

export default class FeedCards extends Component {
  buildPostCards = (posts, refetch) => {
    const userId = localStorage.getItem('userId');

    return posts.map(post => {
      let isOwn = false;
      if (post.owner === userId) {
        isOwn = true;
      }
      return (
        <PrayerCard
          key={post.id}
          id={post.id}
          ownerId={post.owner}
          isOwnCard={isOwn}
          isPartnered={post.isPartnered}
          partneredAmount={post.partnerCount}
          postModifiedHandler={refetch}
        >
          {post.content}
        </PrayerCard>
      );
    });
  };
  render() {
    return <div>{this.buildPostCards(this.props.children)}</div>;
  }
}
