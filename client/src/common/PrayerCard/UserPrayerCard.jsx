/* eslint-disable import/no-webpack-loader-syntax */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import PartnerButton from './PartnerButton';

import OwnCardMenu from './OwnCardMenu';
import MenuDots from '../../assets/icons/menu_dots.svg';

import './PrayerCard.css';

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) {
      id
    }
  }
`;

export default class UserPrayerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPartnered: false,
      isMenuOpen: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.deletePrayer = this.deletePrayer.bind(this);
  }

  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  closeMenu() {
    this.setState({ isMenuOpen: false });
  }

  deletePrayer(apolloClient, id) {
    console.log(apolloClient);

    apolloClient.mutate({
      mutation: DELETE_POST,
      variables: {
        postId: id,
      },
    });

    console.log(`Deleting Card`);
  }

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div className="PrayerCard UserPrayerCard">
            {this.props.children}
            <div className="PrayerCard__left-divider" />
            <div className="PrayerCard__middle-divider" />
            <div className="PrayerCard__right-divider" />
            <PartnerButton
              isPartnered={this.state.isPartnered}
              clickHandler={this.togglePartner}
              partneredAmount={this.props.partnersAmount}
            />
            <MenuDots
              className="PrayerCard__MenuDots"
              onClick={this.toggleMenu}
            />
            <OwnCardMenu
              isOpen={this.state.isMenuOpen}
              closeHandler={this.closeMenu}
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

UserPrayerCard.propTypes = {
  children: PropTypes.string,
  partnersAmount: PropTypes.string,
};

UserPrayerCard.defaultProps = {
  children: '',
  partnersAmount: '0',
};
