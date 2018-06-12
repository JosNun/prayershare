import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import FriendSearchCard from './FriendSearchCard';
import FriendCard from './FriendCard';

class UserFriends extends Component {
  unfollowHandler(id) {
    console.log(`unfollowing person ${id.toString()}`);
  }

  render() {
    const GET_USER_FRIENDS = gql`
      query user {
        user {
          friends {
            id
            firstName
            lastName
            profilePhoto
          }
        }
      }
    `;

    return (
      <div className="Profile-Card-Container">
        <FriendSearchCard onClick={this.unfollowHandler} />
        <Query query={GET_USER_FRIENDS}>
          {({ loading, error, data }) => {
            if (loading) return <h2>Loading...</h2>;
            if (error) return <h3>Uh oh, an error has occured</h3>;

            return (
              <div>
                {data.user.friends.map(friend => {
                  if (friend.profilePhoto) {
                    return (
                      <FriendCard
                        id={friend.id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        avatarUrl={friend.profilePhoto}
                        key={friend.id}
                        unfollowHandler={this.unfollowHandler.bind(
                          this,
                          friend.id
                        )}
                      />
                    );
                  }
                  return (
                    <FriendCard
                      id={friend.id}
                      name={`${friend.firstName} ${friend.lastName}`}
                      key={friend.id}
                      unfollowHandler={this.unfollowHandler.bind(
                        this,
                        friend.id
                      )}
                    />
                  );
                })}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default UserFriends;
