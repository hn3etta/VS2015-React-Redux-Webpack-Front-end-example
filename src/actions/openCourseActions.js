import moment from 'moment';
import * as types from './actionTypes';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

import initState from '../initModels/initialOpenCourseState';
// Action creators
import {beginAjaxCall} from './ajaxStatusActions';
// Utilities/Settings
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';


export function loadOpenCoursesSuccess(immtblOpenCoursesList) {
    return { type: types.LOAD_OPEN_COURSES_SUCCESS, immtblOpenCoursesList: immtblOpenCoursesList };  // ES2015 can consolidate "immtblOpenCoursesList: immtblOpenCoursesList" to just "immtblOpenCoursesList".  Leaving old method for readability
}

export function loadOpenCoursesError(immtblOpenCoursesList) {
    return { type: types.LOAD_OPEN_COURSES_ERROR, immtblOpenCoursesList };
}

export function internalUpdateOpenCourseMsg() {
    return { type: types.INTERNALLY_OPEN_COURSE_UPDATE_MSG };
}

export function internalUpdateOpenCourseSecs(immtblOpenCourseCntr) {
    return { type: types.INTERNALLY_OPEN_COURSE_UPDATE_SECS, immtblOpenCourseCntr };
}

export function internalUpdateOpenCourseIsUpdating(immtblOpenCourseCntr) {
    return { type: types.INTERNALLY_OPEN_COURSE_IS_UPDATING, immtblOpenCourseCntr };
}

export function updatedOpenCourseSuccess(immtblOpenCourseCntr) {
    return { type: types.UPDATED_OPEN_COURSE_SUCCESS, immtblOpenCourseCntr };
}

export function updatedOpenCourseError(immtblOpenCourseCntr) {
    return { type: types.UPDATED_OPEN_COURSE_ERROR, immtblOpenCourseCntr };
}

/* Synchronous Action Thunks */
export function changeOpenCourseRefreshSecs(openCourseId, seconds) {
    return function (dispatch, getState) {
        let openCourseCntrArr = getState().openCoursesReducer.filter(openCourseCntr => openCourseCntr.get("openCourse").get("id") == openCourseId);

        if (openCourseCntrArr.size > 0) {
            // Send specific Open Course's container object with changes
            dispatch(internalUpdateOpenCourseSecs(openCourseCntrArr.get(0).set("refreshSeconds", seconds)));
        }
    };
}

export function openCourseIsUpdating(openCourseId) {
    return function (dispatch, getState) {
        let openCourseCntrArr = getState().openCoursesReducer.filter(openCourseCntr => openCourseCntr.get("openCourse").get("id") == openCourseId);

        if (openCourseCntrArr.size > 0) {
            // Send specific Open Course's container object with changes
            dispatch(internalUpdateOpenCourseIsUpdating(openCourseCntrArr.get(0).set("updating", true)));
        }
    };
}

/* Asynchronous Action Thunks */
export function loadOpenCourses() {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        const bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courseopen/', {
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
              let ajaxEndDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");

              // New immutable list of open courses
              dispatch(loadOpenCoursesSuccess(List(response.map(ocObj => {
                  // Convert plain open course object to Immutable Map object
                  let ocMapObj = Map(ocObj);
                  return initState.openCourseCntr.set("openCourse", ocMapObj)
                                                 .set("statusText", "")
                                                 .set("ajaxStart", ajaxStartDT)
                                                 .set("ajaxEnd", ajaxEndDT)
                                                 .set("animateChart", true)
                                                 .set("updatedMsg", moment(ajaxEndDT, "YYYY-MM-DD:HH:mm:ss.SSS").fromNow());
              }))));
          })
          .catch(error => {
              // New immutable lit with one open course container for holding the error info
              dispatch(loadOpenCoursesError(
                  List().push(initState.openCourseCntr.set("statusText", "Load Open Courses Error: " + error.message)
                                                      .set("ajaxStart", ajaxStartDT)
                                                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"))
                  )
              ));
          });
    };
}

export function refreshOpenCourse(openCourseId) {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        const bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courseOpen/' + openCourseId, {
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
              let ajaxEndDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
              let ocMapObj = Map(response);
              let openCourseCntrArr = getState().openCoursesReducer.filter(openCourseCntr => openCourseCntr.get("openCourse").get("id") == openCourseId);
              
              if (openCourseCntrArr.size > 0) {
                  // Change a specific Open Course's seconds
                  dispatch(updatedOpenCourseSuccess(openCourseCntrArr.get(0).set("openCourse", ocMapObj)
                                                                            .set("statusText", "")
                                                                            .set("updating", false)
                                                                            .set("ajaxStart", ajaxStartDT)
                                                                            .set("ajaxEnd", ajaxEndDT)
                                                                            .set("animateChart", true)
                                                                            .set("updatedMsg", moment(ajaxEndDT, "YYYY-MM-DD:HH:mm:ss.SSS").fromNow())));
              }
          })
          .catch(error => {
              let ajaxEndDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
              let openCourseCntrArr = getState().openCoursesReducer.filter(openCourseCntr => openCourseCntr.get("openCourse").get("id") == openCourseId);

              if (openCourseCntrArr.size > 0) {
                  // Change a specific Open Course's seconds
                  dispatch(updatedOpenCourseError(openCourseCntrArr.get(0).set("statusText", "Load Open Course Error: " + error.message)
                                                                          .set("updating", false)
                                                                          .set("ajaxStart", ajaxStartDT)
                                                                          .set("ajaxEnd", ajaxEndDT)
                                                                          .set("updatedMsg", moment(ajaxEndDT, "YYYY-MM-DD:HH:mm:ss.SSS").fromNow())));
              }
          });
    };
}