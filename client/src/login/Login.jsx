import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, Redirect, withRouter } from 'react-router-dom';
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
class Login extends Component {
  componentDidMount() {
    try {
      window.gapi.signin2.render('g-signin2', {
        clientId:
          '720503767101-mo6k4lulhr6sl5crlpee3lth1kldac4k.apps.googleusercontent.com',
        scope: 'profile email',
        onsuccess: this.onSignIn.bind(this),
      });
    } catch (err) {
      // catch errors because the component mounted before the button was loaded
    }
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

            if (userIsLoggedIn()) {
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

export default withRouter(Login);
