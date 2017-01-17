import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialUserState';

/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function authenticationReducers(state = initialState, action) {
	/* Using switch statement since the number of cases are small */
	switch (action.type) {
		case types.USER_AUTHENTICATED:
			return {
				user: state.user.withMutations(user => {
					user.set('username', action.updatedUsr.username)
						.set('isAuthenticated', action.updatedUsr.isAuthenticated)
						.set('token', action.updatedUsr.token)
						.set('authExpiresIn', action.updatedUsr.authExpiresIn)
						.set('statusText', action.updatedUsr.statusText)
						.set('ajaxStart', action.updatedUsr.ajaxStart)
						.set('ajaxEnd', action.updatedUsr.ajaxEnd);
				})
			};
		case types.AUTHENTICATION_ERROR:
			return {
				user: state.user.withMutations(user => {
					user.set('statusText', action.errorUsr.statusText)
						.set('ajaxStart', action.errorUsr.ajaxStart)
						.set('ajaxEnd', action.errorUsr.ajaxEnd);
				})
			};
		case types.USER_LOGGED_OFF:
			return {
				user: state.user.set('isAuthenticated', false)
			};
		case types.USER_STILL_AUTHENTICATED:
			return {
				user: state.user.set('isAuthenticated', true)
			};
		default:
			return state;
	}
}
