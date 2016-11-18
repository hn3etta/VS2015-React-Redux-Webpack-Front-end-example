import moment from 'moment';
import * as types from './actionTypes';

/* Use "require" for non ES6 Modules */
let jwtDecode = require('jwt-decode');

import initUsrState from '../initModels/initialUserState';
// Action creators
import {beginAjaxCall} from './ajaxStatusActions';
import {loadAuthors} from './authorActions';
import {loadCourses} from './courseActions';
import {loadOpenCourses} from './openCourseActions';
// Utilities/Settings
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';


export function userAuthenticated(immtblUsr) {
    return { type: types.USER_AUTHENTICATED, immtblUsr };
}

export function userAuthenticationError(immtblUsr) {
    return { type: types.AUTHENTICATION_ERROR, immtblUsr };
}

export function userLoggedOff(immtblUsr) {
    return { type: types.USER_LOGGED_OFF, immtblUsr };
}

/* Action Thunks */
export function authenticateUser(username, password) {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/auth/', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
              try {
                  // Decode the JWT to make sure it is valid (throws error) - not saving the results 
                  jwtDecode(response.access_token);

                  // New immutable object setting token, authExpiresIn, isAuthenticated and ajaxEnd that is passed into the userAuthenticated action
                  dispatch(userAuthenticated(getState().authReducer.user.withMutations(mObj => {
                      mObj.set("username", username)
                          .set("token", response.access_token)
                          .set("authExpiresIn", response.expires_in)
                          .set("isAuthenticated", true)
                          .set("statusText", "")
                          .set("ajaxStart", ajaxStartDT)
                          .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
                  })));

                  // Load Authors, Courses and Counts
                  dispatch(loadAuthors());
                  dispatch(loadCourses());
                  dispatch(loadOpenCourses());
              } catch (e) {
                  // New immutable object setting statusText that is passed into the userAuthenticationError action
                  dispatch(userAuthenticationError(getState().authReducer.user.withMutations(mObj => {
                      mObj.set("statusText", e.message)
                          .set("ajaxStart", ajaxStartDT)
                          .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
                  })));
              }
          })
          .catch(error => {
              let errMsg = error.message;

              if (error.response && error.response.status && error.response.status == 400) {
                  errMsg = "Sorry, the username and/or password was incorrect";
              }

              // New immutable object setting statusText that is passed into the userAuthenticationError action
              dispatch(userAuthenticationError(getState().authReducer.user.withMutations(mObj => {
                  mObj.set("statusText", errMsg)
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          });
    };
}

export function logoffUser() {
    return function (dispatch, getState) {
        dispatch(userLoggedOff(getState().authReducer.user.merge(initUsrState.user).set("isAuthenticated",false)));
    };
}
