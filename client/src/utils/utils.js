export function userIsLoggedIn() {
  return Boolean(
    localStorage.getItem('token') && localStorage.getItem('userId')
  );
}
