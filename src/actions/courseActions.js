import moment from 'moment';
import * as types from './actionTypes';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

// Action creators
import {beginAjaxCall} from './ajaxStatusActions';
// Utilities/Settings
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';


export function loadCoursesSuccess(immtblCoursesCntr) {
    return { type: types.LOAD_COURSES_SUCCESS, immtblCoursesCntr: immtblCoursesCntr };  // ES2015 can consolidate "course: course" to just "course".  Leaving old method for readability
}

export function loadCoursesError(immtblCoursesCntr) {
    return { type: types.LOAD_COURSES_ERROR, immtblCoursesCntr };
}

export function createCourseSuccess(immtblCoursesCntr) {
    return { type: types.CREATE_COURSES_SUCCESS, immtblCoursesCntr }; 
}

export function createCourseError(immtblCoursesCntr) {
    return { type: types.CREATE_COURSES_SUCCESS, immtblCoursesCntr };
}

export function updateCourseSuccess(immtblCoursesCntr) {
    return { type: types.UPDATE_COURSES_SUCCESS, immtblCoursesCntr };
}

export function updateCourseError(immtblCoursesCntr) {
    return { type: types.UPDATE_COURSES_ERROR, immtblCoursesCntr };
}

export function deleteCourseSuccess(immtblCoursesCntr) {
    return { type: types.DELETE_COURSE_SUCCESS, immtblCoursesCntr };
}

export function deleteCourseError(immtblCoursesCntr) {
    return { type: types.DELETE_COURSE_ERROR, immtblCoursesCntr };
}

export function updateCourseIsOpen(courseId) {
    return { type: types.UPDATE_COURSE_IS_OPEN, courseId };
}

export function updateCourseIsClosed(courseId) {
    return { type: types.UPDATE_COURSE_IS_CLOSED, courseId };
}

/* Action Thunks */
export function loadCourses() {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");        
        let bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courses/', {
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
              dispatch(loadCoursesSuccess(getState().coursesReducer.coursesCntr.withMutations(mObj => {
                  mObj.set("allCourses", List(response.map(course => Map(course))))
                      .set("statusText", "")
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          })
          .catch(error => {
              // New immutable object setting statusText and ajaxEnd
              dispatch(loadCoursesError(getState().coursesReducer.coursesCntr.withMutations(mObj => {
                  mObj.set("statusText", "Load Courses Error: " + error.message)
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          });
    };
}

export function addCourse(course) {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        let bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courses/', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(course)
        }).then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
              // Get the latest couresCntr from the store
              let immtblCoursesCntr = getState().coursesReducer.coursesCntr;
              // New immutable object updating the existing course in immtblCoursesCntr 
              // and setting ajaxStart and ajaxEnd for immtblCoursesCntr
              // -- for "allCourses" find updated course and convert to Immutable Map and merge with current course
              dispatch(createCourseSuccess(immtblCoursesCntr.withMutations(mObj => {
                  mObj.set("allCourses", immtblCoursesCntr.get("allCourses").push(Map(response)))
                      .set("statusText", "")
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          })
          .catch(error => {
              // New immutable object setting statusText and ajaxEnd
              dispatch(createCourseError(getState().coursesReducer.coursesCntr.withMutations(mObj => {
                  mObj.set("statusText", "Add Course Error: " + error.message)
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          });
    };
}

export function saveCourse(course) {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        let bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courses/', {
            method: 'put',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(course)
        }).then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
              // Get the latest couresCntr from the store
              let immtblCoursesCntr = getState().coursesReducer.coursesCntr;
              // New immutable object updating the existing course in immtblCoursesCntr 
              // and setting ajaxStart and ajaxEnd for immtblCoursesCntr
              // -- for "allCourses" find updated course and convert to Immutable Map and merge with current course
              dispatch(updateCourseSuccess(immtblCoursesCntr.withMutations(mObj => {
                  mObj.set("allCourses", immtblCoursesCntr.get("allCourses").map( c => {
                              if(c.get("id") == course.id){ 
                                  return c.merge(Map(response));
                              }
                              return c;
                          }))
                      .set("statusText", "")
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          })
          .catch(error => {
              // New immutable object setting statusText and ajaxEnd
              dispatch(updateCourseError(getState().coursesReducer.coursesCntr.withMutations(mObj => {
                  mObj.set("statusText", "Update Course Error: " + error.message)
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          });
    };
}

export function deleteCourse(courseId) {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        let bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courses/'+courseId, {
            method: 'delete',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + bearer,
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
          .then(response => {
              // Get the latest couresCntr from the store
              let immtblCoursesCntr = getState().coursesReducer.coursesCntr;
              // New immutable object updating the existing course in immtblCoursesCntr
              // and setting ajaxStart and ajaxEnd for immtblCoursesCntr
              // -- for "allCourses" find updated course and convert to Immutable Map and merge with current course
              dispatch(deleteCourseSuccess(immtblCoursesCntr.withMutations(mObj => {
                  mObj.set("allCourses", immtblCoursesCntr.get("allCourses").filter(c => c.get("id") != courseId))
                      .set("statusText", "")
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          })
          .catch(error => {
              // New immutable object setting statusText and ajaxEnd
              dispatch(deleteCourseError(getState().coursesReducer.coursesCntr.withMutations(mObj => {
                  mObj.set("statusText", "Delete Course Error: " + error.message)
                      .set("ajaxStart", ajaxStartDT)
                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
              })));
          });
    };
}