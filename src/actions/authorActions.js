import moment from 'moment';
import * as types from './actionTypes';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

// Action creators
import {beginAjaxCall} from './ajaxStatusActions';
// Utilities/Settings
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';


export function loadAuthorsSuccess(loadedAuthorsCntr) {
    return { type: types.LOAD_AUTHORS_SUCCESS, loadedAuthorsCntr };
}

export function loadAuthorsError(loadedAuthorsErrorCntr) {
    return { type: types.LOAD_AUTHORS_ERROR, loadedAuthorsErrorCntr };
}

/* Action Thunks - Perform API call for getting Authors */
export function loadAuthors() {
    return (dispatch, getState) => {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        const bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/authors/', {
            method: 'get',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + bearer,
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
              // New immutable object setting allCourses and ajaxEnd
              dispatch(loadAuthorsSuccess(
                  {
                      allAuthors: List(response.map(author => Map(author))),
                      statusText: '',
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
          })
          .catch(error => {
              // New immutable object setting statusText and ajaxEnd
              dispatch(loadAuthorsError(
                  {
                      statusText: "Load Authors Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
          });
    };
}