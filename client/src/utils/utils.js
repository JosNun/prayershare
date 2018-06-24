export const userIsLoggedIn = () =>
  localStorage.getItem('token') && localStorage.getItem('userId');
