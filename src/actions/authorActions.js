import moment from 'moment';
import * as types from './actionTypes';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

// Action creators
import {beginAjaxCall} from './ajaxStatusActions';
// Utilities/Settings
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';


export function loadAuthorsSuccess(immtblAuthorsCntr) {
    return { type: types.LOAD_AUTHORS_SUCCESS, immtblAuthorsCntr };
}

export function loadAuthorsError(immtblAuthorsCntr) {
    return { type: types.LOAD_AUTHORS_ERROR, immtblAuthorsCntr };
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
              dispatch(loadAuthorsSuccess(getState().authorsReducer.authorsCntr.withMutations(mObj => {
                  mObj.set("allAuthors", List(response.map(author => Map(author))))
                      .set("statusText", "")
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          })
          .catch(error => {
              // New immutable object setting statusText and ajaxEnd
              dispatch(loadAuthorsError(getState().authorsReducer.authorsCntr.withMutations(mObj => {
                  mObj.set("statusText", "Load Authors Error: " + error.message)
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          });
    };
}