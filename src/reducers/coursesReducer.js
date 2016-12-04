import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialCourseCntrState';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;

/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function coursesReducers(state = initialState, action) {
    switch (action.type) {
        case types.LOAD_COURSES_SUCCESS:
        case types.LOAD_COURSES_ERROR:
        case types.CREATE_COURSES_SUCCESS:
        case types.CREATE_COURSES_ERROR:
        case types.UPDATE_COURSES_SUCCESS:
        case types.UPDATE_COURSES_ERROR:
        case types.DELETE_COURSE_SUCCESS:
        case types.DELETE_COURSE_ERROR:
            return { coursesCntr: state.coursesCntr.merge(action.immtblCoursesCntr) };
        case types.UPDATE_COURSE_IS_OPEN:
            return {
                /* Find course and set "isOpen" to true and sort the new state by the course's title */
                coursesCntr: state.coursesCntr.withMutations(courseCO => {
                    courseCO.set("allCourses", courseCO.get("allCourses")
                                                       .map(course => {
                                                           if (course.get("id") == action.courseId) {
                                                               return course.set("isOpen", true);
                                                           }
                                                           return course;
                                                       })
                    );
                })
            };
        case types.UPDATE_COURSE_IS_CLOSED:
            return {
                coursesCntr: state.coursesCntr.withMutations(courseCO => {
                    courseCO.set("allCourses", courseCO.get("allCourses")
                                                       .map(course => {
                                                           if (course.get("id") == action.courseId) {
                                                               return course.set("isOpen", false);
                                                           }
                                                           return course;
                                                       })
                    );
                })
            };
        default:
            return state;
    }
}