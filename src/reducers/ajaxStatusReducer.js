import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialAjaxState';
// Utilities/Settings
import {createReducer} from '../utilities/reducerUtilities';

export default function ajaxStatusReducer(state = initialState, action) {

    switch (action.type) {
        case types.BEGIN_AJAX_CALL:
            return { ajaxCallsInProgress: state.ajaxCallsInProgress + 1 };
        case types.LOAD_AUTHORS_SUCCESS:
        case types.LOAD_AUTHORS_ERROR:
        case types.LOAD_COURSES_SUCCESS:
        case types.LOAD_COURSES_ERROR:
        case types.CREATE_COURSES_SUCCESS:
        case types.CREATE_COURSES_ERROR:
        case types.UPDATE_COURSES_SUCCESS:
        case types.UPDATE_COURSES_ERROR:
        case types.DELETE_COURSE_SUCCESS:
        case types.DELETE_COURSE_ERROR:
        case types.USER_AUTHENTICATED:
        case types.AUTHENTICATION_ERROR:
        case types.USER_LOGGED_OFF:
        case types.LOAD_OPEN_COURSES_SUCCESS:
        case types.LOAD_OPEN_COURSES_ERROR:
        case types.UPDATED_OPEN_COURSE_SUCCESS:
        case types.UPDATED_OPEN_COURSE_ERROR:
            return { ajaxCallsInProgress: state.ajaxCallsInProgress - 1 };
    }

    return state;
}