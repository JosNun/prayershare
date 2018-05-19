import React from 'react';
import PropTypes from 'prop-types';
import './CardMenu.css';

const CardMenu = props => (
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

CardMenu.propTypes = {
  isOpen: PropTypes.bool,
  closeHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
};

CardMenu.defaultProps = {
  isOpen: false,
};

export default CardMenu;
