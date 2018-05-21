import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { UserContext } from '../App';

import PrayerCard from '../common/PrayerCard/PrayerCard';

const getPosts = gql`
  query user($id: Int!) {
    user(id: $id) {
      friends {
        posts {
          id
          content
          owner {
            id
          }
        }
      }
    }
  }
`;

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  cardsList(id) {
    if (id) {
      return (
        <Query query={getPosts} variables={{ id }}>
          {({ loading, error, data }) => {
            if (loading) return <PrayerCard>Loading...</PrayerCard>;
            if (error) return <p>Uh oh. An error has occured :(</p>;

            const posts = data.user.friends.reduce(
              (acc, friend) => acc.concat(friend.posts),
              []
            );

            const postCards = posts.map(post => (
              <PrayerCard key={post.id} owner={post.owner.id}>
                {post.content}
              </PrayerCard>
            ));

            return postCards;
          }}
        </Query>
      );
    }
    return <p>Loading...</p>;
  }

  render() {
    return (
      <UserContext.Consumer>
        {userId => <div className="MainView">{this.cardsList(userId)}</div>}
      </UserContext.Consumer>
    );
  }
}
