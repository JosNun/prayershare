import React, { Component } from 'react';
import Modal from '../common/Modal';

let email;

export default class ForgotPassword extends Component {
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
          <h3>Alrighty!</h3>
          <p>Check your email for further instructions.</p>
        </Modal>
      );
    }
    return (
      <Modal>
        <form
          className="Modal__form"
          onSubmit={e => {
            e.preventDefault();
            fetch(`../reset/${email.value}`, {
              method: 'POST',
            }).then(res => {
              this.setState({
                suceeded: true,
              });
            });
          }}
        >
          <h2>Enter your email:</h2>
          <input
            type="email"
            placeholder="email"
            autoComplete="email"
            ref={node => {
              email = node;
            }}
          />
          <input type="submit" value="Reset Password" />
        </form>
      </Modal>
    );
  }
}
