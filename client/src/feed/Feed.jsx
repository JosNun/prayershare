import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import AuthRoute from '../common/utils/AuthRoute';

import CreatePost from '../common/CreatePost';

import PrayerCard from '../common/PrayerCard/PrayerCard';

export const GET_POSTS = gql`
  query getPostFeed($limit: Int, $offset: Int) {
    getPostFeed(limit: $limit, offset: $offset) {
      id
      content
      owner
      partnerCount
      isPartnered
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

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.shouldFetchMore = false;
  }

  cardsList() {
    return (
      <Query
        query={GET_POSTS}
        variables={{
          limit: 10,
          offset: 0,
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data, refetch, fetchMore }) => {
          if (data && Object.keys(data).length !== 0) {
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

            return (
              <React.Fragment>
                {postCards}
                <button
                  className="colored"
                  onClick={() => {
                    console.log(`fetching more`);
                    fetchMore({
                      variables: {
                        offset: posts.length,
                        limit: 10,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;

                        const newPosts = Object.assign({}, prev, {
                          getPostFeed: [
                            ...prev.getPostFeed,
                            ...fetchMoreResult.getPostFeed,
                          ],
                        });

                        return newPosts;
                      },
                    });
                  }}
                >
                  Load More
                </button>
              </React.Fragment>
            );
          }

          if (loading) return <PrayerCard>Loading...</PrayerCard>;
          return <p>Uh oh. An error has occured :(</p>;
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
