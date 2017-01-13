import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialCoursesCntrState';
import {sortByTitle} from '../utilities/courseUtilities';

/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function coursesReducers(state = initialState, action) {
	switch (action.type) {
		case types.LOAD_COURSES_SUCCESS:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					const courses = coursesCntr.get('allCourses')
						.merge(action.loadedCoursesCntr.ImmtblCoursesList)
						.sort(sortByTitle);

					coursesCntr.set('allCourses', courses)
						.set('statusText', action.loadedCoursesCntr.statusText)
						.set('ajaxStart', action.loadedCoursesCntr.ajaxStart)
						.set('ajaxEnd', action.loadedCoursesCntr.ajaxEnd);
				})
			};
		case types.LOAD_COURSES_ERROR:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					coursesCntr.set('statusText', action.loadedCoursesErrorCntr.statusText)
						.set('ajaxStart', action.loadedCoursesErrorCntr.ajaxStart)
						.set('ajaxEnd', action.loadedCoursesErrorCntr.ajaxEnd);
				})
			};
		case types.CREATE_COURSE_SUCCESS:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					const courses = coursesCntr.get('allCourses')
						.push(action.createdCoursesCntr.ImmtblCourse)
						.sort(sortByTitle);

					coursesCntr.set('allCourses', courses)
						.set('statusText', action.createdCoursesCntr.statusText)
						.set('ajaxStart', action.createdCoursesCntr.ajaxStart)
						.set('ajaxEnd', action.createdCoursesCntr.ajaxEnd);
				})
			};
		case types.CREATE_COURSE_ERROR:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					coursesCntr.set('statusText', action.createdCoursesErrorCntr.statusText)
						.set('ajaxStart', action.createdCoursesErrorCntr.ajaxStart)
						.set('ajaxEnd', action.createdCoursesErrorCntr.ajaxEnd);
				})
			};
		case types.UPDATE_COURSE_SUCCESS:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					const courses = coursesCntr.get('allCourses').map(course => {
						if (course.get('id') === action.updatedCourseCntr.ImmtblCourse.get('id')) {
							return course.merge(action.updatedCourseCntr.ImmtblCourse);
						}
						return course;
					}).sort(sortByTitle);

					coursesCntr.set('allCourses', courses)
						.set('statusText', action.updatedCourseCntr.statusText)
						.set('ajaxStart', action.updatedCourseCntr.ajaxStart)
						.set('ajaxEnd', action.updatedCourseCntr.ajaxEnd);
				})
			};
		case types.UPDATE_COURSE_ERROR:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					coursesCntr.set('statusText', action.updatedCourseErrorCntr.statusText)
						.set('ajaxStart', action.updatedCourseErrorCntr.ajaxStart)
						.set('ajaxEnd', action.updatedCourseErrorCntr.ajaxEnd);
				})
			};
		case types.DELETE_COURSE_SUCCESS:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					const courses = coursesCntr.get('allCourses')
						.filter(course => course.get('id') !== action.deletedCourseCntr.courseId)
						.sort(sortByTitle);

					coursesCntr.set('allCourses', courses)
						.set('statusText', action.deletedCourseCntr.statusText)
						.set('ajaxStart', action.deletedCourseCntr.ajaxStart)
						.set('ajaxEnd', action.deletedCourseCntr.ajaxEnd);
				})
			};

		case types.DELETE_COURSE_ERROR:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					coursesCntr.set('statusText', action.deletedCourseErrorCntr.statusText)
						.set('ajaxStart', action.deletedCourseErrorCntr.ajaxStart)
						.set('ajaxEnd', action.deletedCourseErrorCntr.ajaxEnd);
				})
			};
		case types.UPDATE_COURSE_IS_OPEN:
			return {
				/* Find course and set "isOpen" to true and sort the new state by the course's title */
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					coursesCntr.set('allCourses', coursesCntr.get('allCourses').map(course => {
						if (course.get('id') === action.courseId) {
							return course.set('isOpen', true);
						}
						return course;
					}));
				})
			};
		case types.UPDATE_COURSE_IS_CLOSED:
			return {
				coursesCntr: state.coursesCntr.withMutations(coursesCntr => {
					coursesCntr.set('allCourses', coursesCntr.get('allCourses').map(course => {
						if (course.get('id') === action.courseId) {
							return course.set('isOpen', false);
						}
						return course;
					}));
				})
			};
		default:
			return state;
	}
}
