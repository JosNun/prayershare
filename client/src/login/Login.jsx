import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, Redirect } from 'react-router-dom';
import { userIsLoggedIn } from '../utils/utils';
import './Signup.css';

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      firstName
      jwt
    }
  }
`;

let email;

let password;
export default class extends Component {
  componentDidMount() {
    try {
      window.gapi.signin2.render('g-signin2', {
        scope: 'profile email',
        onsuccess: this.onSignIn.bind(this),
      });
    } catch (err) {
      // catch errors because the component mounted before the button was loaded
    }
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
      this.forceUpdate();
    };
    xhr.send(`idtoken=${idToken}`);
  }

  render() {
    return (
      <div
        ref={el => {
          this.instance = el;
        }}
      >
        <Mutation mutation={LOGIN_USER} errorPolicy="all" onError={e => null}>
          {(login, { loading, error, data }) => {
            let errorMessage;

            if (
              error &&
              error.graphQLErrors[0] &&
              error.graphQLErrors[0].name === 'LoginError'
            ) {
              errorMessage = error.graphQLErrors[0].message;
            }

            if (userIsLoggedIn) {
              return <Redirect to="/feed" />;
            }
            if (data) {
              localStorage.setItem('token', data.login.jwt);
              localStorage.setItem('userId', data.login.id);
              return <Redirect to="/feed" />;
            }
            return (
              <div className="Login-Form">
                <h2>Log In</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <form
                  className="Modal__form"
                  onSubmit={e => {
                    e.preventDefault();
                    login({
                      variables: {
                        email: email.value,
                        password: password.value,
                      },
                    }).catch(err => {
                      if (
                        err &&
                        err.graphQLErrors[0] &&
                        err.graphQLErrors[0].name === 'LoginError'
                      ) {
                        return false;
                      }
                    });
                  }}
                >
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
                    autoComplete="current-password"
                    required
                    ref={node => {
                      password = node;
                    }}
                  />
                  <input type="submit" value="Sign In" />
                </form>

                <p>or</p>

                <div className="g-signin2" id="g-signin2" />

                <p>or</p>

                <Link to="/signup">Create an account</Link>
                <h6>
                  <Link to="/forgot">Forgot your password?</Link>
                </h6>
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}
