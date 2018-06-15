import React from 'react';
import PropTypes from 'prop-types';
import './CardMenu.css';

const OwnCardMenu = props => (
  <div>
    <div
      className={props.isOpen ? 'CardMenu open' : 'CardMenu'}
      data-popup="true"
    >
      <div
        className="CardMenu__option CardMenu__option--caution"
        onClick={props.deleteHandler}
        role="button"
      >
        Delete Post
      </div>
    </div>
    <div
      className="CardMenu__backdrop"
      onClick={props.closeHandler}
      role="button"
    />
  </div>
);

OwnCardMenu.propTypes = {
  isOpen: PropTypes.bool,
  closeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
};

OwnCardMenu.defaultProps = {
  isOpen: false,
};

export default OwnCardMenu;
