import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Modal from '../common/Modal';
import './Signup.css';

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
      scope: 'profile email',
      onsuccess: this.onSignIn.bind(this),
    });
  }

  onSignIn(googleUser) {
    const { id_token: idToken } = googleUser.getAuthResponse();
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('POST', '/google-auth');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = () => {
      localStorage.setItem('token', xhr.response.token);
      localStorage.setItem('userId', xhr.response.uid);
      this.props.history.push('/feed');
    };
    xhr.send(`idtoken=${idToken}`);
  }
  render() {
    return (
      <div>
        <Mutation mutation={CREATE_USER}>
          {(createUser, { loading, error, data }) => {
            let errorMessage;
            if (
              localStorage.getItem('token') &&
              localStorage.getItem('userId')
            ) {
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
