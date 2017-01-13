/* eslint-disable complexity */

import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialAjaxState';

export default function ajaxStatusReducer(state = initialState, action) {
	switch (action.type) {
		case types.BEGIN_AJAX_CALL:
			return {ajaxCallsInProgress: state.ajaxCallsInProgress + 1};
		case types.LOAD_AUTHORS_SUCCESS:
		case types.LOAD_AUTHORS_ERROR:
		case types.LOAD_COURSES_SUCCESS:
		case types.LOAD_COURSES_ERROR:
		case types.CREATE_COURSE_SUCCESS:
		case types.CREATE_COURSE_ERROR:
		case types.UPDATE_COURSE_SUCCESS:
		case types.UPDATE_COURSE_ERROR:
		case types.DELETE_COURSE_SUCCESS:
		case types.DELETE_COURSE_ERROR:
		case types.USER_AUTHENTICATED:
		case types.AUTHENTICATION_ERROR:
		case types.USER_LOGGED_OFF:
		case types.LOAD_OPEN_COURSES_SUCCESS:
		case types.LOAD_OPEN_COURSES_ERROR:
		case types.UPDATED_OPEN_COURSE_SUCCESS:
		case types.UPDATED_OPEN_COURSE_ERROR:
		case types.UPDATE_COURSE_IS_OPEN_SUCCESS:
		case types.UPDATE_COURSE_IS_OPEN_NEW_SUCCESS:
		case types.CREATE_COURSE_IS_OPEN_ERROR:
		case types.UPDATE_COURSE_IS_OPEN_ERROR:
		case types.DELETE_COURSE_IS_OPEN_ERROR:
		case types.DELETE_COURSE_IS_OPEN_SUCCESS:
			return {ajaxCallsInProgress: state.ajaxCallsInProgress > 0 ? state.ajaxCallsInProgress - 1 : 0};
		default:
			return state;
	}
}
