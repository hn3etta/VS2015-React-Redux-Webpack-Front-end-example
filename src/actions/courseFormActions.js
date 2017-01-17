import * as types from './actionTypes';

export function openCourseFormScreen(courseId) {
	return {type: types.OPEN_COURSE_FORM_SCREEN, courseId};
}

export function closeCourseFormScreen() {
	return {type: types.CLOSE_COURSE_FORM_SCREEN};
}
