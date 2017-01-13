import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialRedirectState';

export default function redirectReducer(state = initialState, action) {
	switch (action.type) {
		case types.POST_AUTH_REDIRECT_PATH:
			return {redirectOptions: state.redirectOptions.set('postAuthPath', action.newPathName)};
		default:
			return state;
	}
}
