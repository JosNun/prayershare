import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import PrayerCard from '../common/PrayerCard/PrayerCard';

export default () => {
  const GET_USER_POSTS = gql`
    query user {
      user {
        posts {
          content
          partnerCount
          id
        }
      }
    }
  `;

  return (
    <Query query={GET_USER_POSTS} fetchPolicy="cache-and-network">
      {({ loading, error, data, refetch }) => {
        if (loading) return <h2>Loading...</h2>;
        if (error) return <h3>Uh oh, an error has occured :(</h3>;

        return (
          <div className="Profile-Card-Container">
            {data.user.posts.map(post => (
              <PrayerCard
                partnersAmount={post.partnerCount || 0}
                key={post.id}
                id={post.id}
                isOwnCard
                postModifiedHandler={refetch}
              >
                {post.content}
              </PrayerCard>
            ))}
          </div>
        );
      }}
    </Query>
  );
};
