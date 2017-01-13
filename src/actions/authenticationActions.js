import moment from 'moment';
import jwtDecode from 'jwt-decode';

import * as types from './actionTypes';
import {beginAjaxCall} from './ajaxStatusActions';
import {loadAuthors} from './authorActions';
import {loadCourses} from './courseActions';
import {loadOpenCourses} from './openCourseActions';
import {checkHttpStatus, parseJSON} from '../utilities/apiUtilities';

export function userAuthenticated(updatedUsr) {
	return {type: types.USER_AUTHENTICATED, updatedUsr};
}

export function userAuthenticationError(errorUsr) {
	return {type: types.AUTHENTICATION_ERROR, errorUsr};
}

export function logoffUser() {
	return {type: types.USER_LOGGED_OFF};
}

export function userStillAuthenticated() {
	return {type: types.USER_STILL_AUTHENTICATED};
}

/* Action Thunks */
export function authenticateUser(username, password) {
	return function (dispatch) {
		dispatch(beginAjaxCall());

		const ajaxStartDT = moment().format('YYYY-MM-DD:HH:mm:ss.SSS');
		const options = {
			method: 'post',
			mode: 'cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username, password})
		};

		// Call WebAPI using Fetch promises
		return fetch('http://127.0.0.1:1783/api/auth/', options)
			.then(checkHttpStatus)
			.then(parseJSON)
			.then(response => {
				try {
					// Decode the JWT to make sure it is valid (throws error) - not saving the results
					jwtDecode(response.access_token);

					// New immutable object setting token, authExpiresIn, isAuthenticated and ajaxEnd that is passed into the userAuthenticated action
					dispatch(userAuthenticated({
						username,
						token: response.access_token,
						authExpiresIn: response.expires_in,
						isAuthenticated: true,
						statusText: '',
						ajaxStart: ajaxStartDT,
						ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
					}));

					// Load Authors, Courses and Counts
					dispatch(loadAuthors());
					dispatch(loadCourses());
					dispatch(loadOpenCourses());
				} catch (e) {
					// New immutable object setting statusText that is passed into the userAuthenticationError action
					dispatch(userAuthenticationError({
						statusText: 'Auth Error: ' + e.message,
						ajaxStart: ajaxStartDT,
						ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
					}));
				}
			})
			.catch(error => {
				let errMsg = error.message;

				if (error.response && error.response.status && error.response.status === 400) {
					errMsg = 'Sorry, the username and/or password was incorrect';
				}

				// New immutable object setting statusText that is passed into the userAuthenticationError action
				dispatch(userAuthenticationError({
					statusText: errMsg,
					ajaxStart: ajaxStartDT,
					ajaxEnd: moment().format('YYYY-MM-DD:HH:mm:ss.SSS')
				}));
			});
	};
}
