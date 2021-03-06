import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import PartnerButton from './PartnerButton';
import CardMenu from './CardMenu';

import MenuDots from '../../assets/icons/menu_dots.svg';

import './PrayerCard.css';

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      id
    }
  }
`;

const ADD_PARTNERSHIP = gql`
  mutation addPartnership($postId: ID!) {
    addPartnership(postId: $postId) {
      id
    }
  }
`;

const REMOVE_PARTNERSHIP = gql`
  mutation removePartnership($postId: ID!) {
    removePartnership(postId: $postId) {
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

export default class PrayerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPartnered: this.props.isPartnered,
      isMenuOpen: false,
      pulsing: false,
    };

    this.closeMenu = this.closeMenu.bind(this);
    this.deletePrayer = this.deletePrayer.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.togglePartner = this.togglePartner.bind(this);
    this.unfollowPoster = this.unfollowPoster.bind(this);
    this.endPulse = this.endPulse.bind(this);
  }

  togglePartner(apolloClient, id, isPartnered) {
    apolloClient.mutate({
      mutation: !isPartnered ? ADD_PARTNERSHIP : REMOVE_PARTNERSHIP,
      variables: {
        postId: id,
      },
    });
    const wasPartnered = this.state.isPartnered;
    this.setState({
      isPartnered: !wasPartnered,
      pulsing: true,
    });
  }

  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  unfollowPoster(client, ownerId) {
    client.mutate({
      mutation: REMOVE_FRIEND,
      variables: {
        friendId: ownerId,
      },
      refetchQueries: ['getPostFeed', 'user'],
    });
  }

  deletePrayer(apolloClient, id) {
    apolloClient.mutate({
      mutation: DELETE_POST,
      variables: {
        postId: id,
      },
      refetchQueries: [`getPostFeed`, `user`],
      // update: (cache, { data: { deletePost } }) => {
      //   const { getPostFeed: posts } = cache.readQuery({
      //     query: GET_POSTS,
      //   });

      //   const updatedPosts = posts.filter(e => e.id !== deletePost.id);
      //   cache.writeQuery({
      //     query: GET_POSTS,
      //     data: {
      //       getPostFeed: updatedPosts,
      //     },
      //   });
      // },
    });

    // this.props.postModifiedHandler();
  }

  endPulse() {
    this.setState({
      pulsing: false,
    });
  }

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div className="PrayerCard">
            {this.props.children}
            <div className="PrayerCard__left-divider" />
            <div className="PrayerCard__middle-divider" />
            <div className="PrayerCard__right-divider" />
            <PartnerButton
              isPulsing={this.state.pulsing}
              isPartnered={this.state.isPartnered}
              onPulseEnd={this.endPulse}
              clickHandler={
                !this.props.isOwnCard
                  ? this.togglePartner.bind(
                    this,
                    client,
                    this.props.id,
                    this.state.isPartnered
                  )
                  : null
              }
              partneredAmount={
                this.props.isOwnCard && this.props.partneredAmount
              }
            />
            <MenuDots
              className="PrayerCard__MenuDots"
              onClick={this.toggleMenu}
            />
            <CardMenu
              isOpen={this.state.isMenuOpen}
              isOwnCard={this.props.isOwnCard}
              closeHandler={this.closeMenu}
              unfollowHandler={this.unfollowPoster.bind(
                this,
                client,
                this.props.ownerId
              )}
              deleteHandler={this.deletePrayer.bind(
                this,
                client,
                this.props.id
              )}
            />
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

PrayerCard.propTypes = {
  children: PropTypes.string,
};

PrayerCard.defaultProps = {
  children: '',
  isUsers: false,
};
