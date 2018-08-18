import React from 'react';
import './Modal.css';

export default props => (
  <div>
    <div className="Modal__backdrop" onClick={props.onBgClick} />
    <div className="Modal">{props.children}</div>
  </div>
);
