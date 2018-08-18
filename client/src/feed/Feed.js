import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import AuthRoute from '../common/utils/AuthRoute';

import './Feed.css';

import CreatePost from '../common/CreatePost';
import FeedCards from './FeedCards';
import PrayerCard from '../common/PrayerCard/PrayerCard';
import FeedEnd from '../assets/icons/end_of_feed.svg';

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

export default class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canFetchMore: true,
    };
  }

  loadMore(fetchMore, existingPosts) {
    fetchMore({
      variables: {
        offset: existingPosts.length,
        limit: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.getPostFeed.length) {
          this.setState({
            canFetchMore: false,
          });
          return prev;
        }

        const newPosts = Object.assign({}, prev, {
          getPostFeed: [...prev.getPostFeed, ...fetchMoreResult.getPostFeed],
        });

        return newPosts;
      },
    });
  }

  render() {
    return (
      <div>
        <div className="MainView">
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

                return (
                  <React.Fragment>
                    <FeedCards>{posts}</FeedCards>
                    {this.state.canFetchMore ? (
                      <button
                        className="colored full-width"
                        onClick={() => this.loadMore(fetchMore, posts)}
                      >
                        Load More
                      </button>
                    ) : (
                      <FeedEnd className="Feed__end-icon" />
                    )}
                  </React.Fragment>
                );
              }

              if (loading) return <PrayerCard>Loading...</PrayerCard>;
              return <p>Uh oh. An error has occured :(</p>;
            }}
          </Query>
        </div>

        <AuthRoute exact path="/feed/create-post" component={CreatePost} />
      </div>
    );
  }
}
