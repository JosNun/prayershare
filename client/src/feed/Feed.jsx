import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import AuthRoute from '../common/utils/AuthRoute';

import CreatePost from '../common/CreatePost';

import PrayerCard from '../common/PrayerCard/PrayerCard';
import UserPrayerCard from '../common/PrayerCard/UserPrayerCard';

const getPosts = gql`
  query getPostFeed {
    getPostFeed {
      id
      content
      owner
    }
  }
`;

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  cardsList() {
    const userId = localStorage.getItem('userId');
    return (
      <Query query={getPosts} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
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

          const postCards = posts.map(post => {
            if (post.owner === userId) {
              return (
                <UserPrayerCard key={post.id} id={post.id} owner={post.owner}>
                  {post.content}
                </UserPrayerCard>
              );
            }
            return (
              <PrayerCard key={post.id} id={post.id} owner={post.owner}>
                {post.content}
              </PrayerCard>
            );
          });

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
