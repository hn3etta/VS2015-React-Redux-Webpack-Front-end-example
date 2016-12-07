import moment from 'moment';
import * as types from './actionTypes';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

// Model inits
import initCntrState from '../initModels/initialOpenCourseCntrState';
// Action creators
import {beginAjaxCall} from './ajaxStatusActions';
import {updateCourseIsOpen, updateCourseIsClosed} from './courseActions';
import {closeCourseIsOpenFormScreen} from './openCourseFormActions';
// Utilities/Settings
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';
import {getCourseName, sortByCourseName} from '../utilities/openCourseUtilities';

/* Actions for Open Course edits */
export function updateOpenCourseSuccess(updatedOpenCourseCntr) {
    return { type: types.UPDATE_COURSE_IS_OPEN_SUCCESS, updatedOpenCourseCntr };
}

export function updateOpenCourseNewSuccess(newOpenCourseCntr) {
    return { type: types.UPDATE_COURSE_IS_OPEN_NEW_SUCCESS, newOpenCourseCntr };
}

export function updateOpenCourseError(updatedOpenCourseErrorCntr) {
    return { type: types.UPDATE_COURSE_IS_OPEN_ERROR, updatedOpenCourseErrorCntr };
}

export function createOpenCourseError(createOpenCourseErrorCntr) {
    return { type: types.CREATE_COURSE_IS_OPEN_ERROR, createOpenCourseErrorCntr };
}

export function courseNameChangeOccurred(courseNameChange) {
    return { type: types.COURSE_NAME_CHANGE_FOR_OPEN_COURSE, courseNameChange };
}

export function deleteOpenCourseSuccess(id) {
    return { type: types.DELETE_COURSE_IS_OPEN_SUCCESS, id };
}

export function deleteOpenCourseError(deleteOpenCourseErrorCntr) {
    return { type: types.DELETE_COURSE_IS_OPEN_ERROR, deleteOpenCourseErrorCntr };
}

export function courseDeleted(courseId) {
    return { type: types.COURSE_DELETED_CLEAR_OPEN_COURSE, courseId };
}

/* Actions for Open Course status screen (simulator) */
export function loadOpenCoursesSuccess(allOpenCoursesCntr) {
    return { type: types.LOAD_OPEN_COURSES_SUCCESS, allOpenCoursesCntr };
}

export function loadOpenCoursesError(allOpenCoursesErrorCntr) {
    return { type: types.LOAD_OPEN_COURSES_ERROR, allOpenCoursesErrorCntr };
}

export function internalUpdateOpenCourseMsg() {
    return { type: types.INTERNALLY_OPEN_COURSE_UPDATE_MSG };
}

export function internalUpdateOpenCourseSecs(openCourseIdAndSecs) {
    return { type: types.INTERNALLY_OPEN_COURSE_UPDATE_SECS, openCourseIdAndSecs };
}

export function internalUpdateOpenCourseIsUpdating(openCourseId) {
    return { type: types.INTERNALLY_OPEN_COURSE_IS_UPDATING, openCourseId };
}

export function updatedOpenCourseSuccess(openCourseCntrUpdated) {
    return { type: types.UPDATED_OPEN_COURSE_SUCCESS, openCourseCntrUpdated };
}

export function updatedOpenCourseError(openCourseCntrUpdateError) {
    return { type: types.UPDATED_OPEN_COURSE_ERROR, openCourseCntrUpdateError };
}


/* Asynchronous Action Thunks */
export function saveOpenCourse(openCourse) {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        const bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courseopen/', {
            method: 'post',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(openCourse)
        }).then(checkHttpStatus)
          .then(parseJSON)
          .then(response => {
              dispatch(closeCourseIsOpenFormScreen());

              const immtblUpdtdOpenCourse = Map(response);
              const allOpenCoursesList = getState().openCoursesReducer.openCoursesCntr.get("allOpenCourses");

              // Search the openCoursesCntr store for this open course
              let immtblOpenCourseCntr = allOpenCoursesList.find(openCourseCntr => openCourseCntr.get("openCourse").get("id") == immtblUpdtdOpenCourse.get("id"));

              // If openCourse entry exists then dispatch an update
              if (immtblOpenCourseCntr) {
                  dispatch(updateOpenCourseSuccess(
                      {
                          immtblOpenCourse: immtblUpdtdOpenCourse,
                          statusText: '',
                          ajaxStart: ajaxStartDT,
                          ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                      }
                  ));
              } else {
                  dispatch(updateOpenCourseNewSuccess(
                      {
                          immtblOpenCourse: immtblUpdtdOpenCourse,
                          courseName: getCourseName(openCourse.courseId, getState().coursesReducer.coursesCntr.get("allCourses")),
                          statusText: '',
                          ajaxStart: ajaxStartDT,
                          ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                      }
                  ));
                  dispatch(updateCourseIsOpen(immtblUpdtdOpenCourse.get("courseId")));
              }              
          })
          .catch(error => {
              const allOpenCoursesList = getState().openCoursesReducer.openCoursesCntr.get("allOpenCourses");

              let immtblOpenCourseCntr = allOpenCoursesList.find(openCourseCntr => openCourseCntr.get("openCourse").get("id") == openCourse.id);

              if (immtblOpenCourseCntr) {
                  dispatch(updateOpenCourseError(
                      {
                          openCourseId: openCourse.id,
                          statusText: "Save Open Course Error: " + error.message,
                          ajaxStart: ajaxStartDT,
                          ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                      }
                  ));
              } else {
                  dispatch(createOpenCourseError(
                      {
                          statusText: "Create Open Course Error: " + error.message,
                          ajaxStart: ajaxStartDT,
                          ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                      }
                  ));
              }
          });
    };
}

export function deleteOpenCourse(id, courseId) {
    return function (dispatch, getState) {
        dispatch(beginAjaxCall());

        const ajaxStartDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");
        let bearer = getState().authReducer.user.get("token");

        // Call WebAPI using Fetch promises
        return fetch('http://127.0.0.1:1783/api/courseopen/' + id, {
            method: 'delete',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + bearer,
                'Content-Type': 'application/json'
            }
        }).then(checkHttpStatus)
          .then(response => {
              dispatch(closeCourseIsOpenFormScreen());
              dispatch(deleteOpenCourseSuccess(id));
              dispatch(updateCourseIsClosed(courseId));
          })
          .catch(error => {
              dispatch(deleteOpenCourseError(
                  {
                      openCourseId: id,
                      statusText: "Delete Course Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
              ));
          });
    };
}

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
              dispatch(loadOpenCoursesSuccess(
                  {
                      allOpenCourses: List(response.map(openCourse => {
                          return initCntrState.openCourseCntr.set("openCourse", Map(openCourse))
                                                             .set("courseName", getCourseName(openCourse.courseId, getState().coursesReducer.coursesCntr.get("allCourses")))
                                                             .set("animateChart", true)
                                                             .set("updatedMsg", moment(ajaxEndDT, "YYYY-MM-DD:HH:mm:ss.SSS").fromNow())
                                                             .set("ajaxStart", ajaxStartDT)
                                                             .set("ajaxEnd", ajaxEndDT);
                      })),
                      statusText: '',
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: ajaxEndDT
                  }
              ));
          })
          .catch(error => {
              // New immutable lit with one open course container for holding the error info
              dispatch(loadOpenCoursesError(
                  {
                      statusText: "Create Open Course Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: moment().format("YYYY-MM-DD:HH:mm:ss.SSS")
                  }
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
              let ocMapObj = Map(response);
              let ajaxEndDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");

              dispatch(updatedOpenCourseSuccess(
                  {
                      openCourse: Map(response),
                      updating: false,
                      animateChart: true,
                      updatedMsg: moment(ajaxEndDT, "YYYY-MM-DD:HH:mm:ss.SSS").fromNow(),
                      statusText: "",
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: ajaxEndDT
                  }
              ));
          })
          .catch(error => {
              let ajaxEndDT = moment().format("YYYY-MM-DD:HH:mm:ss.SSS");

              dispatch(updatedOpenCourseError(
                  {
                      openCourseId,
                      updating: false,
                      updatedMsg: moment(ajaxEndDT, "YYYY-MM-DD:HH:mm:ss.SSS").fromNow(),
                      statusText: "Load Open Course Error: " + error.message,
                      ajaxStart: ajaxStartDT,
                      ajaxEnd: ajaxEndDT
                  }
              ));
          });
    };
}