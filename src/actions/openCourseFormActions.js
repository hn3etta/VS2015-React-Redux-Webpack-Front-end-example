import * as types from './actionTypes';

export function openCourseIsOpenFormScreen(courseId) {
	return {type: types.OPEN_COURSE_IS_OPEN_SCREEN, courseId};
}

export function closeCourseIsOpenFormScreen() {
	return {type: types.CLOSE_COURSE_IS_OPEN_SCREEN};
}
