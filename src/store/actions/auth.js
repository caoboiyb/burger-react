import * as actionTypes from './actionTypes';
import axios from 'axios';

const authStart = () => ({
  type: actionTypes.AUTH_START,
});

const authSuccess = (token, userId) => ({
  type: actionTypes.AUTH_SUCCESS,
  idToken: token,
  userId: userId,
});

const authFail = (err) => ({
  type: actionTypes.AUTH_FAIL,
  error: err,
});

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignup) => (dispatch) => {
  dispatch(authStart());
  const authData = {
    email,
    password,
    returnSecureToken: true,
  };
  let url =
    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyDjKQ68TfAymh32G3cFhgYElE7YLPoGfCQ';
  if (!isSignup) {
    url =
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyDjKQ68TfAymh32G3cFhgYElE7YLPoGfCQ';
  }
  axios
    .post(url, authData)
    .then((response) => {
      console.log(response);
      const expirationDate = new Date(
        new Date().getTime() + response.data.expiresIn * 1000,
      );
      localStorage.setItem('token', response.data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('userId', response.data.localId);
      dispatch(authSuccess(response.data.idToken, response.data.localId));
      dispatch(checkAuthTimeout(response.data.expiresIn));
    })
    .catch((err) => {
      console.log(err);
      dispatch(authFail(err.response.data.error));
    });
};

export const setAuthRedirectPath = (path) => ({
  type: actionTypes.SET_AUTH_REDIRECT_PATH,
  path: path,
});

export const authCheckState = () => async (dispatch) => {
  const token = await localStorage.getItem('token');
  if (!token) {
    dispatch(logout());
  } else {
    const expirationDate = await new Date(
      localStorage.getItem('expirationDate'),
    );
    if (expirationDate > new Date()) {
      const userId = await localStorage.getItem('userId');
      dispatch(authSuccess(token, userId));
      dispatch(
        checkAuthTimeout(expirationDate.getSeconds() - new Date().getSeconds()),
      );
    } else {
      dispatch(logout());
    }
  }
};
