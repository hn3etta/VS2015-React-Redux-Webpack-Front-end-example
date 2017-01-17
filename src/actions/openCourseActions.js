import moment from 'moment';
import {List, Map} from 'immutable';

import * as types from './actionTypes';
import {beginAjaxCall} from './ajaxStatusActions';
import {updateCourseIsOpen, updateCourseIsClosed} from './courseActions';
import {closeCourseIsOpenFormScreen} from './openCourseFormActions';
import initCntrState from '../initModels/initialOpenCourseCntrState';
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';
import {getCourseName} from '../utilities/openCourseUtilities';

/* Actions for Open Course edits */
export function updateOpenCourseSuccess(updatedOpenCourseCntr) {
	return {type: types.UPDATE_COURSE_IS_OPEN_SUCCESS, updatedOpenCourseCntr};
}

export function updateOpenCourseNewSuccess(newOpenCourseCntr) {
	return {type: types.UPDATE_COURSE_IS_OPEN_NEW_SUCCESS, newOpenCourseCntr};
}

export function updateOpenCourseError(updatedOpenCourseErrorCntr) {
	return {type: types.UPDATE_COURSE_IS_OPEN_ERROR, updatedOpenCourseErrorCntr};
}

export function createOpenCourseError(createOpenCourseErrorCntr) {
	return {type: types.CREATE_COURSE_IS_OPEN_ERROR, createOpenCourseErrorCntr};
}

export function courseNameChangeOccurred(courseNameChange) {
	return {type: types.COURSE_NAME_CHANGE_FOR_OPEN_COURSE, courseNameChange};
}

export function deleteOpenCourseSuccess(id) {
	return {type: types.DELETE_COURSE_IS_OPEN_SUCCESS, id};
}

export function deleteOpenCourseError(deleteOpenCourseErrorCntr) {
	return {type: types.DELETE_COURSE_IS_OPEN_ERROR, deleteOpenCourseErrorCntr};
}

export function courseDeleted(courseId) {
	return {type: types.COURSE_DELETED_CLEAR_OPEN_COURSE, courseId};
}

/* Actions for Open Course status screen (simulator) */
export function loadOpenCoursesSuccess(allOpenCoursesCntr) {
	return {type: types.LOAD_OPEN_COURSES_SUCCESS, allOpenCoursesCntr};
}

export function loadOpenCoursesError(allOpenCoursesErrorCntr) {
	return {type: types.LOAD_OPEN_COURSES_ERROR, allOpenCoursesErrorCntr};
}

export function internalUpdateOpenCourseMsg() {
	return {type: types.INTERNALLY_OPEN_COURSE_UPDATE_MSG};
}

export function internalUpdateOpenCourseSecs(openCourseIdAndSecs) {
	return {type: types.INTERNALLY_OPEN_COURSE_UPDATE_SECS, openCourseIdAndSecs};
}

export function internalUpdateOpenCourseIsUpdating(openCourseId) {
	return {type: types.INTERNALLY_OPEN_COURSE_IS_UPDATING, openCourseId};
}

export function updatedOpenCourseSuccess(openCourseCntrUpdated) {
	return {type: types.UPDATED_OPEN_COURSE_SUCCESS, openCourseCntrUpdated};
}

export function updatedOpenCourseError(openCourseCntrUpdateError) {
	return {type: types.UPDATED_OPEN_COURSE_ERROR, openCourseCntrUpdateError};
}

/* Asynchronous Action Thunks */
export function saveOpenCourse(openCourse) {
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
			body: JSON.stringify(openCourse)
		};

		// Call WebAPI using Fetch promises
		return fetch('http://127.0.0.1:1783/api/courseopen/', options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				dispatch(closeCourseIsOpenFormScreen());

				const immtblUpdtdOpenCourse = Map(response);
				const allOpenCoursesList = getState().openCoursesReducer.openCoursesCntr.get('allOpenCourses');

				// Search the openCoursesCntr store for this open course
				const immtblOpenCourseCntr = allOpenCoursesList.find(openCourseCntr => openCourseCntr.get('openCourse').get('id') === immtblUpdtdOpenCourse.get('id'));

				// If openCourse entry exists then dispatch an update
				if (immtblOpenCourseCntr) {
					// Dispatch save open courses success with a temporary object
					dispatch(updateOpenCourseSuccess({
						openCourse: immtblUpdtdOpenCourse,
						statusText: '',
						ajaxStart: ajaxStartDT,
						ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
					}));
				} else {
					// Dispatch new open courses success with a temporary object
					dispatch(updateOpenCourseNewSuccess({
						openCourse: immtblUpdtdOpenCourse,
						courseName: getCourseName(openCourse.courseId, getState().coursesReducer.coursesCntr.get('allCourses')),
						statusText: '',
						ajaxStart: ajaxStartDT,
						ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
					}));
					dispatch(updateCourseIsOpen(immtblUpdtdOpenCourse.get('courseId')));
				}
			})
			.catch(err => {
				const allOpenCoursesList = getState().openCoursesReducer.openCoursesCntr.get('allOpenCourses');
				const immtblOpenCourseCntr = allOpenCoursesList.find(openCourseCntr => openCourseCntr.get('openCourse').get('id') === openCourse.id);

				if (immtblOpenCourseCntr) {
					// Dispatch open course save error with a temporary object
					dispatch(updateOpenCourseError({
						openCourseId: openCourse.id,
						statusText: 'Save Open Course Error: ' + err.message,
						ajaxStart: ajaxStartDT,
						ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
					}));
				} else {
					// Dispatch new open course error with a temporary object
					dispatch(createOpenCourseError({
						statusText: 'Create Open Course Error: ' + err.message,
						ajaxStart: ajaxStartDT,
						ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
					}));
				}
			});
	};
}

export function deleteOpenCourse(id, courseId) {
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
		return fetch('http://127.0.0.1:1783/api/courseopen/' + id, options)
			.then(checkHttpStatus)
			.then(() => {
				// Dispatch close open course modal, delete open course success and change course to closed
				dispatch(closeCourseIsOpenFormScreen());
				dispatch(deleteOpenCourseSuccess(id));
				dispatch(updateCourseIsClosed(courseId));
			})
			.catch(err => {
				// Dispatch open course delete error with a temporary object
				dispatch(deleteOpenCourseError({
					openCourseId: id,
					statusText: 'Delete Course Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}

export function loadOpenCourses() {
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
		return fetch('http://127.0.0.1:1783/api/courseopen/', options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				const ajaxEndDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');

				// Dispatch open courses success with a temporary object
				dispatch(loadOpenCoursesSuccess({
					allOpenCourses: List(response.map(openCourse => {
						return initCntrState.openCourseCntr.set('openCourse', Map(openCourse))
							.set('courseName', getCourseName(openCourse.courseId, getState().coursesReducer.coursesCntr.get('allCourses')))
							.set('animateChart', true)
							.set('updatedMsg', moment(ajaxEndDT, 'YYYY-MM-DD:HH:mm:ss.SSS').fromNow())
							.set('ajaxStart', ajaxStartDT)
							.set('ajaxEnd', ajaxEndDT);
					})),
					statusText: '',
					ajaxStart: ajaxStartDT,
					ajaxEnd: ajaxEndDT
				}));
			})
			.catch(err => {
				// Dispatch open courses error with a temporary object
				dispatch(loadOpenCoursesError({
					statusText: 'Create Open Course Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}

export function refreshOpenCourse(openCourseId) {
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
		return fetch('http://127.0.0.1:1783/api/courseOpen/' + openCourseId, options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				const ajaxEndDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');

				// Dispatch open course refresh success with a temporary object
				dispatch(updatedOpenCourseSuccess({
					openCourse: Map(response),
					updating: false,
					animateChart: true,
					updatedMsg: moment(ajaxEndDT, 'YYYY-MM-DD:HH:mm:ss.SSS').fromNow(),
					statusText: '',
					ajaxStart: ajaxStartDT,
					ajaxEnd: ajaxEndDT
				}));
			})
			.catch(err => {
				const ajaxEndDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');

				// Dispatch open course refresh error with a temporary object
				dispatch(updatedOpenCourseError({
					openCourseId,
					updating: false,
					updatedMsg: moment(ajaxEndDT, 'YYYY-MM-DD:HH:mm:ss.SSS').fromNow(),
					statusText: 'Load Open Course Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: ajaxEndDT
				}));
			});
	};
}
