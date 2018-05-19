import React from 'react';
import PropTypes from 'prop-types';
/* eslint-disable import/no-webpack-loader-syntax */
import PartnerIcon from '../../assets/icons/handshake_icon.svg';

import './PartnerButton.css';

const PartnerButton = props => (
  <div
    className={
      (props.isPartnered
        ? 'PartnerButton PartnerButton--partnered '
        : 'PartnerButton ') + (props.partneredAmount ? ' hasPartners' : '')
    }
    onClick={props.clickHandler}
  >
    <PartnerIcon />
    <div>{props.partneredAmount ? `x ${props.partneredAmount}` : ''}</div>
  </div>
);

PartnerButton.propTypes = {
  isPartnered: PropTypes.bool,
  clickHandler: PropTypes.func,
};

PartnerButton.defaultProps = {
  isPartnered: false,
  clickHandler: () => {},
};

export default PartnerButton;
