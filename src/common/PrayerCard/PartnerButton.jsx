import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable import/no-webpack-loader-syntax */
import PartnerIcon from '-!react-svg-loader!../../assets/icons/handshake_icon.svg';

import './PartnerButton.css';

const PartnerButton = props => (
  <div
    className={
      props.isPartnered
        ? 'PartnerButton PartnerButton--partnered'
        : 'PartnerButton'
    }
    onClick={props.clickHandler}
  >
    <PartnerIcon />
  </div>
);

PartnerButton.propTypes = {
  isPartnered: PropTypes.bool,
  clickHandler: PropTypes.func.isRequired,
};

PartnerButton.defaultProps = {
  isPartnered: false,
};

export default PartnerButton;
