import {Map} from 'immutable';

export default {
	user: Map({
		username: '',
		isAuthenticated: undefined,
		token: undefined,
		authExpiresIn: 0,
		statusText: '',
		ajaxStart: undefined,
		ajaxEnd: undefined
	})
};
