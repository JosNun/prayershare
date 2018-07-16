import { createError } from 'apollo-errors';

export const SignupError = createError('SignupError', {
  message: 'An account already exists for the provided email.',
});

export const LoginError = createError('LoginError', {
  message: 'You have provided an invalid email or password.',
});
