import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import FriendSearchCard from './FriendSearchCard';
import FriendCard from './FriendCard';

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

const SEARCH_USERS = gql`
  query users($limit: Int, $filter: String) {
    users(limit: $limit, filter: $filter) {
      firstName
      lastName
      id
      profilePhoto
    }
  }
`;

const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
    addFriend(friendId: $friendId) {
      id
    }
  }
`;

const REMOVE_FRIEND = gql`
  mutation removeFriend($friendId: ID!) {
    removeFriend(friendId: $friendId) {
      id
    }
  }
`;

class UserFriends extends Component {
  constructor() {
    super();

    this.state = {
      users: null,
      friends: null,
      isShowingFriends: true,
    };

    this.searchUsers = this.searchUsers.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.addFriendHandler = this.addFriendHandler.bind(this);
    this.unfollowHandler = this.unfollowHandler.bind(this);
  }

  componentDidMount() {
    this.getFriends();
  }

  onUsersFetched = users => {
    const markedUsers = this.markUserFriends(users, this.state.friends);

    this.setState({
      users: markedUsers,
      isShowingFriends: false,
    });
  };

  onFriendsFetched = friends => {
    const markedFriends = friends.map(friend => ({
      ...friend,
      isFriend: true,
    }));

    this.setState({
      friends: markedFriends,
      users: markedFriends,
      isShowingFriends: true,
    });
  };

  getFriends(client) {
    const apolloClient = client || this.client;

    apolloClient
      .query({
        query: GET_USER_FRIENDS,
        fetchPolicy: 'network-only',
      })
      .then(({ data: newData, loading: isLoading, error: isErr }) => {
        if (isErr) return <p>error</p>;
        if (isLoading) return <p>loading...</p>;
        this.onFriendsFetched(newData.user.friends);
      });
  }

  markUserFriends(users, friends) {
    if (!users || !friends) return users;
    const markedUsers = users.map(user => {
      const isFriend = friends.find(friend => {
        if (user.id === friend.id) return true;
        return false;
      });
      if (isFriend) {
        return {
          ...user,
          isFriend: true,
        };
      }
      return user;
    });
    return markedUsers;
  }

  addFriendHandler(client, friendId) {
    const apolloClient = client || this.client;

    apolloClient.mutate({
      mutation: ADD_FRIEND,
      variables: {
        friendId,
      },
    });

    const index = this.state.users.findIndex(el => el.id === friendId);

    const users = this.state.users.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          isFriend: true,
        };
      }
      return item;
    });

    this.setState({
      users,
    });
  }

  unfollowHandler(client, friendId) {
    const apolloClient = client || this.client;

    apolloClient.mutate({ mutation: REMOVE_FRIEND, variables: { friendId } });

    const index = this.state.users.findIndex(el => el.id === friendId);

    const users = this.state.users.map((item, i) => {
      if (i === index) {
        return { ...item, isFriend: false };
      }
      return item;
    });

    this.setState({ users });
  }

  searchUsers(client, filter) {
    const apolloClient = client || this.client;

    apolloClient
      .query({
        query: SEARCH_USERS,
        variables: {
          limit: 10,
          filter: filter || '',
        },
      })
      .then(({ data: newData, loading: isLoading, error: isErr }) => {
        if (isErr) return <p>error</p>;
        if (isLoading) return <p>loading...</p>;
        this.onUsersFetched(newData.users);
      });
  }

  client;

  render() {
    return (
      <div className="Profile-Card-Container">
        <ApolloConsumer>
          {client => {
            this.client = client;
            return (
              <div className="w-100">
                <FriendSearchCard
                  performSearch={this.searchUsers}
                  showFriends={this.getFriends}
                  client={client}
                />
                {this.state.friends &&
                this.state.friends.length === 0 &&
                this.state.users &&
                this.state.users.length === 0 ? (
                  <h3>You have no friends :(</h3>
                ) : (
                  ''
                )}
                {this.state.users &&
                  this.state.users.map(friend => (
                    <FriendCard
                      id={friend.id}
                      name={`${friend.firstName} ${friend.lastName}`}
                      avatarUrl={friend.profilePhoto}
                      isFriend={friend.isFriend}
                      key={friend.id}
                      apolloClient={client}
                      unfollowHandler={e => {
                        this.unfollowHandler(client, friend.id);
                        if (this.state.isShowingFriends) {
                          this.getFriends();
                        }
                      }}
                      addFriendHandler={e => {
                        this.addFriendHandler(client, friend.id);
                        if (this.state.isShowingFriends) {
                          this.getFriends();
                        }
                      }}
                    />
                  ))}
              </div>
            );
          }}
        </ApolloConsumer>
      </div>
    );
  }
}

export default UserFriends;
