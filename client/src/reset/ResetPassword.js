import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../common/Modal';

let password;

export default class ResetPassword extends Component {
  constructor(props) {
    super();
    this.state = {
      suceeded: false,
    };
  }

  render() {
    if (this.state.suceeded) {
      return (
        <Modal>
          <h3>Success!</h3>
          <p>
            Now you can <Link to="/login">login</Link> using your new password.
          </p>
        </Modal>
      );
    }
    return (
      <Modal>
        <form
          className="Modal__form"
          onSubmit={e => {
            e.preventDefault();
            fetch(
              `../password-reset/${this.props.match.params.hash}/${
                password.value
              }`,
              {
                method: 'POST',
              }
            ).then(res => {
              this.setState({
                suceeded: true,
              });
            });
          }}
        >
          <h2>Enter a new password:</h2>
          <input
            type="password"
            placeholder="password"
            autoComplete="new-password"
            ref={node => {
              password = node;
            }}
          />
          <input type="submit" value="Reset Password" />
        </form>
      </Modal>
    );
  }
}
