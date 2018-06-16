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

const GET_POSTS = gql`
  query getPostFeed {
    getPostFeed {
      id
      content
      owner
    }
  }
`;

export default class PrayerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPartnered: false,
      isMenuOpen: false,
    };

    this.closeMenu = this.closeMenu.bind(this);
    this.deletePrayer = this.deletePrayer.bind(this);
    this.hidePrayer = this.hidePrayer.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.togglePartner = this.togglePartner.bind(this);
    this.unfollowPoster = this.unfollowPoster.bind(this);
  }

  togglePartner() {
    const wasPartnered = this.state.isPartnered;
    this.setState({
      isPartnered: !wasPartnered,
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

  hidePrayer() {
    console.log(`Hiding Card`);
  }

  unfollowPoster() {
    console.log(`Unfollowing poster`);
  }

  deletePrayer(apolloClient, id) {
    apolloClient.mutate({
      mutation: DELETE_POST,
      variables: {
        postId: id,
      },
      // refetchQueries: [`getPostFeed`],
      update: (cache, { data: { deletePost } }) => {
        const { getPostFeed: posts } = cache.readQuery({
          query: GET_POSTS,
        });

        const updatedPosts = posts.filter(e => e.id !== deletePost.id);
        cache.writeQuery({
          query: GET_POSTS,
          data: {
            getPostFeed: updatedPosts,
          },
        });
      },
    });

    // this.props.postModifiedHandler();
    console.log(`Deleting Card`);
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
              isPartnered={this.state.isPartnered}
              clickHandler={!this.props.isOwnCard ? this.togglePartner : null}
              partneredAmount={
                this.props.isOwnCard && (this.props.partneredAmount || 0)
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
              hideHandler={this.hidePrayer}
              unfollowHandler={this.unfollowPoster}
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
