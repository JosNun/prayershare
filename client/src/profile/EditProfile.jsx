import React, { Component } from 'react';
import Modal from '../common/Modal';
import { Link } from 'react-router-dom';

export default class EditProfile extends Component {
  render() {
    return (
      <Modal>
        <h1>Uh Oh.</h1>
        <p>
          This feature isn't available yet :( Feel free{' '}
          <Link to="/contact">ask for it</Link>, and we'll try to push it up a
          bit higher on the priority list :)
        </p>
        <button
          className="Modal__submit-button"
          onClick={() => {
            window.history.back();
          }}
        >
          Go Back
        </button>
      </Modal>
    );
  }
}
