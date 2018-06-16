import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import AuthRoute from '../common/utils/AuthRoute';

import CreatePost from '../common/CreatePost';

import PrayerCard from '../common/PrayerCard/PrayerCard';

export const GET_POSTS = gql`
  query getPostFeed {
    getPostFeed {
      id
      content
      owner
    }
  }
`;

const buildPostCards = (posts, refetch) => {
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
        owner={post.owner}
        isOwnCard={isOwn}
        partneredAmount={0}
        postModifiedHandler={refetch}
      >
        {post.content}
      </PrayerCard>
    );
  });
};

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  cardsList() {
    return (
      <Query query={GET_POSTS} fetchPolicy="cache-first">
        {({ loading, error, data, refetch }) => {
          if (loading) return <PrayerCard>Loading...</PrayerCard>;
          if (error) return <p>Uh oh. An error has occured :(</p>;

          const posts = data.getPostFeed;

          if (posts.length === 0) {
            return (
              <div>
                <h3>No posts in your feed!</h3>
                <p>Try adding some friends!</p>
              </div>
            );
          }

          const postCards = buildPostCards(posts, refetch);

          return postCards;
        }}
      </Query>
    );
  }

  render() {
    return (
      <div>
        <div className="MainView">{this.cardsList()}</div>
        <AuthRoute exact path="/feed/create-post" component={CreatePost} />
      </div>
    );
  }
}
