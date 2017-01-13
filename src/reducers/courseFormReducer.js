import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialModalState';

export default function courseFormReducer(state = initialState, action) {
	switch (action.type) {
		case types.OPEN_COURSE_FORM_SCREEN:
			return {
				modalData: state.modalData
					.set('courseId', action.courseId)
					.set('open', true)
			};
		case types.CLOSE_COURSE_FORM_SCREEN:
			return {
				modalData: state.modalData
					.set('open', false)
			};
		default:
			return state;
	}
}
