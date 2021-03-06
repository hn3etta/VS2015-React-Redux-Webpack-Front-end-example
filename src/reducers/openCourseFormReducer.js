import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialModalState';

export default function openCourseFormReducer(state = initialState, action) {
	switch (action.type) {
		case types.OPEN_COURSE_IS_OPEN_SCREEN:
			return {
				modalData: state.modalData
					.set('courseId', action.courseId)
					.set('open', true)
			};
		case types.CLOSE_COURSE_IS_OPEN_SCREEN:
			return {
				modalData: state.modalData
					.set('open', false)
			};
		default:
			return state;
	}
}
