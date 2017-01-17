import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialAnimationsState';

export default function animationsReducer(state = initialState, action) {
	switch (action.type) {
		case types.LOGIN_PAGE_INITIAL_ANIMATION:
			return {animationSettings: state.animationSettings.set('loginDisplay', false)};
		default:
			return state;
	}
}
