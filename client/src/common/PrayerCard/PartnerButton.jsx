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
        : 'PartnerButton ') +
      (props.partneredAmount || props.partneredAmount === 0
        ? ' hasPartners'
        : '') +
      (props.isPulsing ? 'pulsing' : '')
    }
    onClick={props.clickHandler}
    onAnimationEnd={props.onPulseEnd}
  >
    <PartnerIcon />
    <div>
      {props.partneredAmount || props.partneredAmount === 0
        ? `x ${props.partneredAmount}`
        : ''}
    </div>
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
