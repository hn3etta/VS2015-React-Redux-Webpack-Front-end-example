import moment from 'moment';
import {List, Map} from 'immutable';

import * as types from './actionTypes';
import {beginAjaxCall} from './ajaxStatusActions';
import {courseNameChangeOccurred, loadOpenCourses, courseDeleted} from './openCourseActions';
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';

export function loadCoursesSuccess(loadedCoursesCntr) {
	return {type: types.LOAD_COURSES_SUCCESS, loadedCoursesCntr};  // ES2015 can consolidate "course: course" to just "course".  Leaving old method for readability
}

export function loadCoursesError(loadedCoursesErrorCntr) {
	return {type: types.LOAD_COURSES_ERROR, loadedCoursesErrorCntr};
}

export function createCourseSuccess(createdCoursesCntr) {
	return {type: types.CREATE_COURSE_SUCCESS, createdCoursesCntr};
}

export function createCourseError(createdCoursesErrorCntr) {
	return {type: types.CREATE_COURSE_ERROR, createdCoursesErrorCntr};
}

export function updateCourseSuccess(updatedCourseCntr) {
	return {type: types.UPDATE_COURSE_SUCCESS, updatedCourseCntr};
}

export function updateCourseError(updatedCourseErrorCntr) {
	return {type: types.UPDATE_COURSE_ERROR, updatedCourseErrorCntr};
}

export function deleteCourseSuccess(deletedCourseCntr) {
	return {type: types.DELETE_COURSE_SUCCESS, deletedCourseCntr};
}

export function deleteCourseError(deletedCourseErrorCntr) {
	return {type: types.DELETE_COURSE_ERROR, deletedCourseErrorCntr};
}

export function updateCourseIsOpen(courseId) {
	return {type: types.UPDATE_COURSE_IS_OPEN, courseId};
}

export function updateCourseIsClosed(courseId) {
	return {type: types.UPDATE_COURSE_IS_CLOSED, courseId};
}

/* Action Thunks */
export function loadCourses() {
	return function (dispatch, getState) {
		dispatch(beginAjaxCall());

		const ajaxStartDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');
		const bearer = getState().authReducer.user.get('token');
		const options = {
			method: 'get',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + bearer,
				'Content-Type': 'application/json'
			}
		};

		// Call WebAPI using Fetch promises
		return fetch('http://127.0.0.1:1783/api/courses/', options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				// Dispatch courses created with a temporary object
				dispatch(loadCoursesSuccess({
					ImmtblCoursesList: List(response.map(course => Map(course))),
					statusText: '',
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
				dispatch(loadOpenCourses());
			})
			.catch(err => {
				// Dispatch courses error with a temporary object
				dispatch(loadCoursesError({
					statusText: 'Load Course Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}

export function addCourse(course) {
	return function (dispatch, getState) {
		dispatch(beginAjaxCall());

		const ajaxStartDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');
		const bearer = getState().authReducer.user.get('token');
		const options = {
			method: 'post',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + bearer,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(course)
		};

		// Call WebAPI using Fetch promises
		return fetch('http://127.0.0.1:1783/api/courses/', options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				// Dispatch course created with a temporary object
				dispatch(createCourseSuccess({
					ImmtblCourse: Map(response),
					statusText: '',
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			})
			.catch(err => {
				// Dispatch add course error with a temporary object
				dispatch(createCourseError({
					statusText: 'Add Course Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}

export function saveCourse(course) {
	return function (dispatch, getState) {
		dispatch(beginAjaxCall());

		const ajaxStartDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');
		const bearer = getState().authReducer.user.get('token');
		const options = {
			method: 'put',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + bearer,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(course)
		};

		// Call WebAPI using Fetch promises
		return fetch('http://127.0.0.1:1783/api/courses/', options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				// Dispatch updated course with a temporary object
				dispatch(updateCourseSuccess({
					ImmtblCourse: Map(response),
					statusText: '',
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
				// Dispatch updated course name with a temporary object
				dispatch(courseNameChangeOccurred({
					courseId: course.id,
					name: course.title
				}));
			})
			.catch(err => {
				// Dispatch course save error with a temporary object
				dispatch(updateCourseError({
					statusText: 'Update Course Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}

export function deleteCourse(courseId) {
	return function (dispatch, getState) {
		dispatch(beginAjaxCall());

		const ajaxStartDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');
		const bearer = getState().authReducer.user.get('token');
		const options = {
			method: 'delete',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + bearer,
				'Content-Type': 'application/json'
			}
		};

		// Call WebAPI using Fetch promises
		return fetch('http://127.0.0.1:1783/api/courses/' + courseId, options)
			.then(checkHttpStatus)
			.then(() => {
				// Dispatch deleted course with a temporary object
				dispatch(deleteCourseSuccess({
					courseId,
					statusText: '',
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));

				dispatch(courseDeleted(courseId));
			})
			.catch(err => {
				// Dispatch deleted course error with a temporary object
				dispatch(deleteCourseError({
					statusText: 'Delete Course Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}
