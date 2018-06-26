import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Modal from '../common/Modal';
import './Signup.css';
import { userIsLoggedIn } from '../utils/utils';

const CREATE_USER = gql`
  mutation createUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    createUser(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      id
      firstName
    }
  }
`;

let email;
let password;
let firstName;
let lastName;

class Signup extends Component {
  componentDidMount() {
    window.gapi.signin2.render('g-signin2', {
      clientId:
        '720503767101-mo6k4lulhr6sl5crlpee3lth1kldac4k.apps.googleusercontent.com',
      scope: 'profile email',
      onsuccess: this.onSignIn.bind(this),
    });
  }

  onSignIn(googleUser) {
    const { id_token: idToken } = googleUser.getAuthResponse();

    fetch('/google-auth', {
      body: JSON.stringify({
        idToken,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
    })
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.uid);
        window.gapi.auth2
          .getAuthInstance()
          .signOut()
          .then(() => {
            this.props.history.push('/feed');
          });
      });
  }

  render() {
    return (
      <div>
        <Mutation mutation={CREATE_USER}>
          {(createUser, { loading, error, data }) => {
            let errorMessage;
            if (userIsLoggedIn()) {
              return <Redirect to="/feed" />;
            }

            if (
              error &&
              error.graphQLErrors[0] &&
              error.graphQLErrors[0].name === 'SignupError'
            ) {
              errorMessage = error.graphQLErrors[0].message;
            }
            if (data && data.createUser) {
              return (
                <Modal>
                  <h3>
                    {data.createUser.firstName}, your account has been created!
                  </h3>
                  <p>
                    Go check your email to verify it, then{' '}
                    <Link to="/login">login</Link>
                  </p>
                </Modal>
              );
            }
            return (
              <div className="Login-Form">
                <h2>Sign Up</h2>
                {errorMessage && (
                  <p className="error">
                    {errorMessage}
                    <br />
                    Perhaps you would like to
                    <br />
                    <Link to="/forgot">reset your password?</Link>
                  </p>
                )}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    createUser({
                      variables: {
                        email: email.value,
                        password: password.value,
                        firstName: firstName.value,
                        lastName: lastName.value,
                      },
                    }).catch(err => {
                      if (
                        err &&
                        err.graphQLErrors[0] &&
                        err.graphQLErrors[0].name === 'SignupError'
                      ) {
                        return false;
                      }
                      console.log(err);
                    });
                  }}
                >
                  <input
                    type="firstName"
                    placeholder="First name"
                    autoComplete="given-name"
                    required
                    ref={node => {
                      firstName = node;
                    }}
                  />
                  <input
                    type="lastName"
                    placeholder="Last name"
                    autoComplete="family-name"
                    required
                    ref={node => {
                      lastName = node;
                    }}
                  />
                  <input
                    type="email"
                    placeholder="email"
                    autoComplete="email"
                    required
                    ref={node => {
                      email = node;
                    }}
                  />
                  <input
                    type="password"
                    placeholder="password"
                    autoComplete="new-password"
                    required
                    ref={node => {
                      password = node;
                    }}
                  />
                  <input type="submit" />
                </form>

                <p>or</p>

                <div className="g-signin2" id="g-signin2" />

                <p>or</p>

                <Link to="/login">Login</Link>
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signup);
