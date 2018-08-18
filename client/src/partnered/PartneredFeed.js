import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import AuthRoute from '../common/utils/AuthRoute';

import CreatePost from '../common/CreatePost';

import PrayerCard from '../common/PrayerCard/PrayerCard';

export const GET_PARTNERED_POSTS = gql`
  query user {
    user {
      partneredPosts {
        id
        content
        owner
        isPartnered
      }
    }
  }
`;

const buildPostCards = (posts, refetch) =>
  posts.map(post => (
    <PrayerCard
      key={post.id}
      id={post.id}
      owner={post.owner}
      isPartnered={post.isPartnered}
      postModifiedHandler={refetch}
    >
      {post.content}
    </PrayerCard>
  ));

export default class PartneredFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  cardsList() {
    return (
      <Query query={GET_PARTNERED_POSTS} fetchPolicy="cache-and-network">
        {({ loading, error, data, refetch }) => {
          if (loading) return <PrayerCard>Loading...</PrayerCard>;
          if (error) return <p>Uh oh. An error has occured :(</p>;

          const posts = data.user.partneredPosts;

          if (posts.length === 0) {
            return (
              <div>
                <h3>No partnered posts!</h3>
                <p>Try partnering with some in your feed.</p>
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
