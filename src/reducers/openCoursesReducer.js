import moment from 'moment';
import * as types from '../actions/actionTypes';

/* Use "require" for non ES6 Modules */
let List = require('immutable').List;
// Utilities/Settings
import {sortByCourseName} from '../utilities/openCourseUtilities';


/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function openCoursesReducer(state = List(), action) {
    switch (action.type) {
        case types.INTERNALLY_OPEN_COURSE_UPDATE_MSG:
            return state.map(openCourseCntrMapObj => {
                // Set the OpenCourse Map object's updated message using Moment
                return openCourseCntrMapObj.withMutations(ocMapObj => {
                    ocMapObj.set("updatedMsg", moment(ocMapObj.get("ajaxEnd"), "YYYY-MM-DD:HH:mm:ss.SSS").fromNow());
                    // Turn off the chart animation for the updated message refresh
                    ocMapObj.set("animateChart", false);
                });
            });
        case types.INTERNALLY_OPEN_COURSE_UPDATE_SECS:
        case types.INTERNALLY_OPEN_COURSE_IS_UPDATING:
            return state.map(openCourseCntrMapObj => {
                if (openCourseCntrMapObj.get("openCourse").get("id") == action.immtblOpenCourseCntr.get("openCourse").get("id")) {
                    return action.immtblOpenCourseCntr.set("animateChart", false);
                }
                return openCourseCntrMapObj.set("animateChart", false);
            });
        case types.UPDATED_OPEN_COURSE_SUCCESS:
            return state.map(openCourseCntrMapObj => {
                if (openCourseCntrMapObj.get("openCourse").get("id") == action.immtblOpenCourseCntr.get("openCourse").get("id")) {
                    return action.immtblOpenCourseCntr;
                }
                return openCourseCntrMapObj.set("animateChart", false);
            });
        case types.UPDATED_OPEN_COURSE_ERROR:
        case types.UPDATE_COURSE_IS_OPEN_SUCCESS:
        case types.UPDATE_COURSE_IS_OPEN_ERROR:
        case types.DELETE_COURSE_IS_OPEN_ERROR:
            return state.map(openCourseCntrMapObj => {
                if (openCourseCntrMapObj.get("openCourse").get("id") == action.immtblOpenCourseCntr.get("openCourse").get("id")) {
                    return action.immtblOpenCourseCntr;
                }
                return openCourseCntrMapObj;
            });
        case types.UPDATE_COURSE_IS_OPEN_NEW_SUCCESS:
            return state.push(action.immtblOpenCourseCntr)
                        .sort(sortByCourseName);
        case types.DELETE_COURSE_IS_OPEN_SUCCESS:
            return state.filter(openCourseCntrMapObj => openCourseCntrMapObj.get("openCourse").get("id") != action.id);
        case types.LOAD_OPEN_COURSES_SUCCESS:
        case types.LOAD_OPEN_COURSES_ERROR:
            return state.merge(action.immtblOpenCoursesList);
        case types.COURSE_NAME_CHANGE_FOR_OPEN_COURSE:
            return state.map(openCourseCntrMapObj => {
                if (openCourseCntrMapObj.get("openCourse").get("courseId") == action.courseNameChange.courseId) {
                    return openCourseCntrMapObj.set("courseName", action.courseNameChange.name);
                }
                return openCourseCntrMapObj;
            });
        default:
            return state;
    }
}