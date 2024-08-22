import axios from 'axios';
import toastr from 'toastr';

/**
 * @description redirect user when token fails
 *
 * @param {string} error -error message
 *
 * @returns {boolean} -returns boolean
 */
export const tokenRedirect = (error) => {
  if (error === 'Token authentication failure') {
    localStorage.removeItem('postitUser');
    localStorage.removeItem('postitToken');
    location.replace('/login?redirect=token');
    toastr.error('You need to login again');
  }
  return false;
};
/**
 *
 * @param {boolean} isLoading -isLoading boolean
 *
 * @returns {object} -returns object
 */
export const loginLoading = (isLoading) => ({
  type: 'LOGIN_LOADING',
  isLoading,
});

/**
 *
 * @param {object} user -user object
 *
 * @returns {object} -returns object
 */
export const userAuthSuccess = (user) => ({
  type: 'AUTHENTICATE_USER',
  user,
});

/**
 *
 * @param {boolean} isLoading -loading boolean
 *
 * @returns {object} -returns object
 */
export const signupLoading = (isLoading) => ({
  type: 'SIGNUP_LOADING',
  isLoading,
});

/**
 *
 * @param {object}  error -error object
 *
 * @returns {object} -returns object
 */
export const loginError = (error) => ({
  type: 'LOGIN_ERROR',
  error,
});

/**
 *
 * @param {string} error -error string
 *
 * @returns {object} -returns object
 */
export const signupError = (error) => ({
  type: 'SIGNUP_ERROR',
  error,
});

/**
 * @description stores user details
 *
 * @param {object} response -response object
 *
 * @returns {void} -returns nothing
 */
const storeUserDetails = (response) => {
  localStorage.setItem('postitToken', response.data.user.token);
  localStorage.setItem('postitUser', JSON.stringify(response.data.user));
  axios.defaults.headers.common['x-access-token'] =
    localStorage.getItem('postitToken');
};

/**
 * @description login user
 *
 * @param {object} user -user object
 * @param {object} history -history object
 *
 * @returns {promise} -returns a promise
 */
export const loginUser = (user, history) => (dispatch) =>
  axios
    .post('/api/user/signin', user)
    .then((response) => {
      dispatch(userAuthSuccess(response.data));
      dispatch(loginLoading(false));
      storeUserDetails(response);
      history.push('/dashboard');
    })
    .catch(({ response }) => {
      dispatch(loginLoading(false));
      dispatch(loginError(response.data.error));
    });

/**
 * @description signs up user
 *
 * @param {object} user -user object
 * @param {object} history -history object
 *
 * @returns {promise} -returns a promise
 */
export const signupUser = (user, history) => (dispatch) =>
  axios
    .post('/api/user/signup', user)
    .then((response) => {
      if (response.status === 201) {
        dispatch(userAuthSuccess(user));
        storeUserDetails(response);
        history.push('/dashboard');
      }
    })
    .catch(({ response }) => {
      dispatch(signupLoading(false));
      dispatch(signupError(response.data.error));
    });
