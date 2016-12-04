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
import {getCourseName} from '../utilities/openCourseUtilities';
import {sortByCourseName} from '../utilities/openCourseUtilities';

/* Actions for Open Course edits */
export function updateOpenCourseSuccess(immtblOpenCourseCntr) {
    return { type: types.UPDATE_COURSE_IS_OPEN_SUCCESS, immtblOpenCourseCntr };
}

export function updateOpenCourseNewSuccess(immtblOpenCourseCntr) {
    return { type: types.UPDATE_COURSE_IS_OPEN_NEW_SUCCESS, immtblOpenCourseCntr };
}

export function updateOpenCourseError(immtblOpenCourseCntr) {
    return { type: types.UPDATE_COURSE_IS_OPEN_ERROR, immtblOpenCourseCntr };
}

export function courseNameChangeOccurred(courseNameChange) {
    return { type: types.COURSE_NAME_CHANGE_FOR_OPEN_COURSE, courseNameChange };
}

export function deleteOpenCourseSuccess(id) {
    return { type: types.DELETE_COURSE_IS_OPEN_SUCCESS, id };
}

export function deleteOpenCourseError(immtblOpenCourseCntr) {
    return { type: types.DELETE_COURSE_IS_OPEN_ERROR, immtblOpenCourseCntr };
}

/* Actions for Open Course status screen (simulator) */
export function loadOpenCoursesSuccess(immtblOpenCoursesList) {
    return { type: types.LOAD_OPEN_COURSES_SUCCESS, immtblOpenCoursesList };
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
              // Get the latest openCouresCntr from the store
              let immtblOpenCoursesCntr = getState().openCoursesReducer.find(openCourseCntr => openCourseCntr.get("openCourse").get("id") == immtblUpdtdOpenCourse.get("id"));

              // If openCourse entry exists then mutate copy
              if (immtblOpenCoursesCntr) {
                  dispatch(updateOpenCourseSuccess(immtblOpenCoursesCntr.set("openCourse", immtblUpdtdOpenCourse)
                                                                        .set("statusText", "")
                                                                        .set("ajaxStart", ajaxStartDT)
                                                                        .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"))));
              } else {
                  dispatch(updateOpenCourseNewSuccess(initCntrState.openCourseCntr.set("openCourse", immtblUpdtdOpenCourse)
                                                                                  .set("statusText", "")
                                                                                  .set("courseName", getCourseName(openCourse.courseId, getState().coursesReducer.coursesCntr.get("allCourses")))
                                                                                  .set("ajaxStart", ajaxStartDT)
                                                                                  .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"))));
                  dispatch(updateCourseIsOpen(immtblUpdtdOpenCourse.get("courseId")));
              }              
          })
          .catch(error => {
              let immtblOpenCoursesCntr = getState().openCoursesReducer.find(openCourseCntr => openCourseCntr.get("openCourse").get("id") == openCourse.id);

              if (immtblOpenCoursesCntr) {
                  dispatch(updateOpenCourseError(immtblOpenCoursesCntr.set("statusText", "Save Open Course Error: " + error.message)
                                                                      .set("ajaxStart", ajaxStartDT)
                                                                      .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"))));
              } else {
                  // !!! Todo !!!
                  // How do I handle an UPSERT when the insert fails?  No openCourseCntr exists in the list.  Rework the list and create a parent container to house the error?
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
              // Get the latest openCouresCntr from the store
              let immtblOpenCoursesCntr = getState().openCoursesReducer.find(openCourseCntr => openCourseCntr.get("openCourse").get("id") == id);

              if (immtblOpenCoursesCntr) {
                  dispatch(deleteOpenCourseError(immtblOpenCoursesCntr.withMutations(mObj => {
                      mObj.set("statusText", "Delete Course Error: " + error.message)
                          .set("ajaxStart", ajaxStartDT)
                          .set("ajaxEnd", moment().format("YYYY-MM-DD:HH:mm:ss.SSS"));
                  })));
              }
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
                  List(response.map(ocObj => {
                      // Convert plain open course object to Immutable Map object
                      let ocMapObj = Map(ocObj);
                      return initCntrState.openCourseCntr.set("openCourse", ocMapObj)
                                                         .set("courseName", getCourseName(ocMapObj.get("courseId"), getState().coursesReducer.coursesCntr.get("allCourses")))
                                                         .set("statusText", "")
                                                         .set("ajaxStart", ajaxStartDT)
                                                         .set("ajaxEnd", ajaxEndDT)
                                                         .set("animateChart", true)
                                                         .set("updatedMsg", moment(ajaxEndDT, "YYYY-MM-DD:HH:mm:ss.SSS").fromNow());
                  }))
                  .sort(sortByCourseName)
              ));
          })
          .catch(error => {
              // New immutable lit with one open course container for holding the error info
              dispatch(loadOpenCoursesError(
                  List().push(initCntrState.openCourseCntr.set("statusText", "Load Open Courses Error: " + error.message)
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