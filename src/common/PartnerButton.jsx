import React, { Component } from 'react';
/* eslint-disable import/no-webpack-loader-syntax */
import PartnerIcon from '-!react-svg-loader!../assets/icons/handshake_icon.svg';

import './PartnerButton.css';

class PartnerButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPartnered: this.props.isPartnered || false,
    };

    this.toggleActive = this.toggleActive.bind(this);
  }

  toggleActive() {
    this.setState({
      isPartnered: !this.state.isPartnered,
    });
  }

  render() {
    return (
      <div
        className={
          this.state.isPartnered
            ? 'PartnerButton PartnerButton--partnered'
            : 'PartnerButton'
        }
        onClick={this.toggleActive}
      >
        <PartnerIcon />
      </div>
    );
  }
}

export default PartnerButton;
