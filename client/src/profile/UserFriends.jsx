import React, { Component } from 'react';

import FriendSearchCard from './FriendSearchCard';
import FriendCard from './FriendCard';

const dummyFriends = [
  {
    name: 'John Smith',
    id: 5,
    avatarUrl: null,
  },
  {
    name: 'Alexander T. Great',
    id: 643,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a1/AlexanderTheGreat_Bust_Transparent.png',
  },
  {
    name: 'John Smith',
    id: 5432,
    avatarUrl: null,
  },
  {
    name: 'Alexander T. Great',
    id: 6433421,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a1/AlexanderTheGreat_Bust_Transparent.png',
  },
  {
    name: 'John Smith',
    id: 595,
    avatarUrl: null,
  },
  {
    name: 'Alexander T. Great',
    id: 64343,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a1/AlexanderTheGreat_Bust_Transparent.png',
  },
  {
    name: 'John Smith',
    id: 3455,
    avatarUrl: null,
  },
  {
    name: 'Alexander T. Great',
    id: 64783,
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a1/AlexanderTheGreat_Bust_Transparent.png',
  },
];

class UserFriends extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: dummyFriends,
    };

    // this.unfollowHandler = this.unfollowHandler.bind(this);
  }

  unfollowHandler(id) {
    console.log(`unfollowing person ${id.toString()}`);
  }

  // makeFriendCards() {
  //   const friendCards = ;

  //   friendCards.push(<div onClick={this.unfollowHandler}>Hello</div>);
  //   return friendCards;
  // }

  render() {
    const friendCards = this.state.friends.map(friend => {
      if (friend.avatarUrl) {
        return (
          <FriendCard
            id={friend.id}
            name={friend.name}
            avatarUrl={friend.avatarUrl}
            key={friend.id}
            unfollowHandler={this.unfollowHandler.bind(this, friend.id)}
          />
        );
      }
      return (
        <FriendCard
          id={friend.id}
          name={friend.name}
          key={friend.id}
          unfollowHandler={this.unfollowHandler.bind(this, friend.id)}
        />
      );
    });

    return (
      <div className="Profile-Card-Container">
        <FriendSearchCard onClick={this.unfollowHandler} />
        {friendCards}
      </div>
    );
  }
}

export default UserFriends;
