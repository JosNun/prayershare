import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import UserPrayerCard from '../common/PrayerCard/UserPrayerCard';

export default () => {
  const GET_USER_POSTS = gql`
    query user($userId: ID!) {
      user(id: $userId) {
        posts {
          content
          partnerCount
          id
        }
      }
    }
  `;

  return (
    <Query query={GET_USER_POSTS} variables={{ userId: 'dXNlcnM6Njg=' }}>
      {({ loading, error, data }) => {
        if (loading) return <h2>Loading...</h2>;
        if (error) return <h3>Uh oh, an error has occured :(</h3>;

        return (
          <div className="Profile-Card-Container">
            {data.user.posts.map(post => (
              <UserPrayerCard
                partnersAmount={post.partnerCount}
                key={post.id}
                isUsers
              >
                {post.content}
              </UserPrayerCard>
            ))}
          </div>
        );
      }}
    </Query>
  );
};
