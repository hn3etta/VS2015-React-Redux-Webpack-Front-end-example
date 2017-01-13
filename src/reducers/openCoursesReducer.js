import moment from 'moment';

import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialOpenCoursesCntrState';
import initialOpenCourseCntr from '../initModels/initialOpenCourseCntrState';
import {sortByCourseName} from '../utilities/openCourseUtilities';

/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function openCoursesReducer(state = initialState, action) {
	switch (action.type) {
		case types.UPDATE_COURSE_IS_OPEN_SUCCESS:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses',
						openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
							if (openCourseCntr.get('openCourse').get('id') === action.updatedOpenCourseCntr.openCourse.get('id')) {
								const course = openCourseCntr.get('openCourse')
									.merge(action.updatedOpenCourseCntr.openCourse);

								return openCourseCntr.set('openCourse', course)
									.set('statusText', action.updatedOpenCourseCntr.statusText)
									.set('ajaxStart', action.updatedOpenCourseCntr.ajaxStart)
									.set('ajaxEnd', action.updatedOpenCourseCntr.ajaxEnd);
							}
							return openCourseCntr;
						})
					);
				})
			};
		case types.UPDATE_COURSE_IS_OPEN_NEW_SUCCESS:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses')
						.push(
							initialOpenCourseCntr.openCourseCntr.set('openCourse', action.newOpenCourseCntr.openCourse)
								.set('courseName', action.newOpenCourseCntr.courseName)
								.set('statusText', action.newOpenCourseCntr.statusText)
								.set('ajaxStart', action.newOpenCourseCntr.ajaxStart)
								.set('ajaxEnd', action.newOpenCourseCntr.ajaxEnd)
						)
						.sort(sortByCourseName)
					);
				})
			};
		case types.UPDATE_COURSE_IS_OPEN_ERROR:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						if (openCourseCntr.get('openCourse').get('id') === action.updatedOpenCourseErrorCntr.openCourseId) {
							return openCourseCntr.set('statusText', action.updatedOpenCourseErrorCntropenCourseCntr.statusText)
								.set('ajaxStart', action.updatedOpenCourseErrorCntropenCourseCntr.ajaxStart)
								.set('ajaxEnd', action.updatedOpenCourseErrorCntropenCourseCntr.ajaxEnd);
						}
						return openCourseCntr;
					}));
				})
			};
		case types.CREATE_COURSE_IS_OPEN_ERROR:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('statusText', action.createOpenCourseErrorCntr.statusText)
						.set('ajaxStart', action.createOpenCourseErrorCntr.statusText)
						.set('ajaxEnd', action.createOpenCourseErrorCntr.statusText);
				})
			};
		case types.COURSE_NAME_CHANGE_FOR_OPEN_COURSE:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						// Set the OpenCourseContainer object's updated message using Moment
						if (openCourseCntr.get('openCourse').get('courseId') === action.courseNameChange.courseId) {
							return openCourseCntr.set('courseName', action.courseNameChange.name);
						}
						return openCourseCntr;
					})
					.sort(sortByCourseName));
				})
			};
		case types.DELETE_COURSE_IS_OPEN_SUCCESS:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses')
						.filter(openCourseCntr => openCourseCntr.get('openCourse').get('id') !== action.id)
					);
				})
			};
		case types.DELETE_COURSE_IS_OPEN_ERROR:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						// Find matching OpenCourseContainer object and return the new OpenCourseContainer object.
						if (openCourseCntr.get('openCourse').get('id') === action.deleteOpenCourseErrorCntr.openCourseId) {
							return openCourseCntr.set('statusText', action.deleteOpenCourseErrorCntr.statusText)
								.set('ajaxStart', action.deleteOpenCourseErrorCntr.ajaxStart)
								.set('ajaxEnd', action.deleteOpenCourseErrorCntr.ajaxEnd);
						}
						return openCourseCntr;
					}));
				})
			};
		case types.COURSE_DELETED_CLEAR_OPEN_COURSE:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCourseCntr => {
					openCourseCntr.set('allOpenCourses', openCourseCntr.get('allOpenCourses')
						.filter(ocCntr => ocCntr.get('openCourse').get('id') !== action.courseId)
					);
				})
			};
		case types.LOAD_OPEN_COURSES_SUCCESS:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					const courses = openCoursesCntr.get('allOpenCourses')
						.merge(action.allOpenCoursesCntr.allOpenCourses)
						.sort(sortByCourseName);

					openCoursesCntr.set('allOpenCourses', courses)
						.set('statusText', action.allOpenCoursesCntr.statusText)
						.set('ajaxStart', action.allOpenCoursesCntr.ajaxStart)
						.set('ajaxEnd', action.allOpenCoursesCntr.ajaxEnd);
				})
			};
		case types.LOAD_OPEN_COURSES_ERROR:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('statusText', action.allOpenCoursesErrorCntr.statusText)
						.set('ajaxStart', action.allOpenCoursesErrorCntr.ajaxStart)
						.set('ajaxEnd', action.allOpenCoursesErrorCntr.ajaxEnd);
				})
			};
		case types.INTERNALLY_OPEN_COURSE_UPDATE_MSG:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						// Set the OpenCourseContainer object's updated message using Moment
						return openCourseCntr.withMutations(ocCntr => {
							ocCntr.set('updatedMsg', moment(ocCntr.get('ajaxEnd'), 'YYYY-MM-DD:HH:mm:ss.SSS').fromNow());
							// Turn off the chart animation for the updated message refresh
							ocCntr.set('animateChart', false);
						});
					}));
				})
			};
		case types.INTERNALLY_OPEN_COURSE_UPDATE_SECS:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						// Set the OpenCourseContainer object's updated message using Moment
						if (openCourseCntr.get('openCourse').get('id') === action.openCourseIdAndSecs.openCourseId) {
							return openCourseCntr.set('animateChart', false).set('refreshSeconds', action.openCourseIdAndSecs.seconds);
						}
						return openCourseCntr.set('animateChart', false);
					}));
				})
			};
		case types.INTERNALLY_OPEN_COURSE_IS_UPDATING:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						// Set the OpenCourseContainer's "updating" property to ture
						if (openCourseCntr.get('openCourse').get('id') === action.openCourseId) {
							return openCourseCntr.set('updating', true).set('animateChart', false);
						}
						return openCourseCntr.set('animateChart', false);
					}));
				})
			};
		case types.UPDATED_OPEN_COURSE_SUCCESS:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						// Find matching OpenCourseContainer object and return the new OpenCourseContainer object.
						if (openCourseCntr.get('openCourse').get('id') === action.openCourseCntrUpdated.openCourse.get('id')) {
							return openCourseCntr.merge(action.openCourseCntrUpdated);
						}
						return openCourseCntr.set('animateChart', false);
					}));
				})
			};
		case types.UPDATED_OPEN_COURSE_ERROR:
			return {
				openCoursesCntr: state.openCoursesCntr.withMutations(openCoursesCntr => {
					openCoursesCntr.set('allOpenCourses', openCoursesCntr.get('allOpenCourses').map(openCourseCntr => {
						// Find matching OpenCourseContainer object and return the new OpenCourseContainer object.
						if (openCourseCntr.get('openCourse').get('id') === action.openCourseCntrUpdateError.openCourseId) {
							return openCourseCntr.set('updating', action.openCourseCntrUpdateError.updating)
								.set('updatedMsg', action.openCourseCntrUpdateError.updatedMsg)
								.set('statusText', action.openCourseCntrUpdateError.statusText)
								.set('ajaxStart', action.openCourseCntrUpdateError.ajaxStart)
								.set('ajaxEnd', action.openCourseCntrUpdateError.ajaxEnd);
						}
						return openCourseCntr.set('animateChart', false);
					}));
				})
			};
		default:
			return state;
	}
}
