import moment from 'moment';
import {List, Map} from 'immutable';

import * as types from './actionTypes';
import {beginAjaxCall} from './ajaxStatusActions';
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';

export function loadAuthorsSuccess(loadedAuthorsCntr) {
	return {type: types.LOAD_AUTHORS_SUCCESS, loadedAuthorsCntr};
}

export function loadAuthorsError(loadedAuthorsErrorCntr) {
	return {type: types.LOAD_AUTHORS_ERROR, loadedAuthorsErrorCntr};
}

/* Action Thunks - Perform API call for getting Authors */
export function loadAuthors() {
	return (dispatch, getState) => {
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
		return fetch('http://127.0.0.1:1783/api/authors/', options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				// New immutable object setting allCourses and ajaxEnd
				dispatch(loadAuthorsSuccess({
					allAuthors: List(response.map(author => Map(author))),
					statusText: '',
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			})
			.catch(err => {
				// New immutable object setting statusText and ajaxEnd
				dispatch(loadAuthorsError({
					statusText: 'Load Authors Error: ' + err.message,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}
