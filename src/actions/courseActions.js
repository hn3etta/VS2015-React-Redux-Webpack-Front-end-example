import moment from 'moment';
import * as types from './actionTypes';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

// Model inits

// Action creators
import {beginAjaxCall} from './ajaxStatusActions';
import {courseNameChangeOccurred, loadOpenCourses, courseDeleted} from './openCourseActions';
// Utilities/Settings
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';
import {sortByTitle} from '../utilities/courseUtilities';

export function loadCoursesSuccess(loadedCoursesCntr) {
    return { type: types.LOAD_COURSES_SUCCESS, loadedCoursesCntr: loadedCoursesCntr };  // ES2015 can consolidate "course: course" to just "course".  Leaving old method for readability
}

export function loadCoursesError(loadedCoursesErrorCntr) {
    return { type: types.LOAD_COURSES_ERROR, loadedCoursesErrorCntr };
}

export function createCourseSuccess(createdCoursesCntr) {
    return { type: types.CREATE_COURSE_SUCCESS, createdCoursesCntr }; 
}

export function createCourseError(createdCoursesErrorCntr) {
    return { type: types.CREATE_COURSE_ERROR, createdCoursesErrorCntr };
}

export function updateCourseSuccess(updatedCourseCntr) {
    return { type: types.UPDATE_COURSE_SUCCESS, updatedCourseCntr };
}

export function updateCourseError(updatedCourseErrorCntr) {
    return { type: types.UPDATE_COURSE_ERROR, updatedCourseErrorCntr };
}

export function deleteCourseSuccess(deletedCourseCntr) {
    return { type: types.DELETE_COURSE_SUCCESS, deletedCourseCntr };
}

export function deleteCourseError(deletedCourseErrorCntr) {
    return { type: types.DELETE_COURSE_ERROR, deletedCourseErrorCntr };
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
              // Dispatch courses created with a temporary object
              dispatch(loadCoursesSuccess(
                  {
                      ImmtblCoursesList: List(response.map(course => Map(course))),
                      statusText: "",
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
              dispatch(loadOpenCourses());
          })
          .catch(error => {
              // Dispatch courses error with a temporary object
              dispatch(loadCoursesError(
                  {
                      statusText: "Load Course Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
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
              // Dispatch course created with a temporary object
              dispatch(createCourseSuccess(
                  {
                      ImmtblCourse: Map(response),
                      statusText: "",
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
          })
          .catch(error => {
              // Dispatch add course error with a temporary object
              dispatch(createCourseError(
                  {
                      statusText: "Add Course Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
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
              // Dispatch updated course with a temporary object
              dispatch(updateCourseSuccess(
                  {
                      ImmtblCourse: Map(response),
                      statusText: "",
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
              // Dispatch updated course name with a temporary object
              dispatch(courseNameChangeOccurred(
                  {
                      courseId: course.id,
                      name: course.title
                  }));
          })
          .catch(error => {
              // Dispatch course save error with a temporary object
              dispatch(updateCourseError(
                  {
                      statusText: "Update Course Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
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
              // Dispatch deleted course with a temporary object
              dispatch(deleteCourseSuccess(
                  {
                      courseId: courseId,
                      statusText: "",
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));

              dispatch(courseDeleted(courseId));
          })
          .catch(error => {
              // Dispatch deleted course error with a temporary object
              dispatch(deleteCourseError(
                  {
                      statusText: "Delete Course Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
          });
    };
}