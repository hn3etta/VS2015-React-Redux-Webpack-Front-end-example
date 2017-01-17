import {combineReducers} from 'redux';

import coursesReducer from './coursesReducer';
import authorsReducer from './authorsReducer';
import ajaxCallsReducer from './ajaxStatusReducer';
import courseFormReducer from './courseFormReducer';
import authReducer from './authenticationReducer';
import animationsReducer from './animationsReducer';
import openCoursesReducer from './openCoursesReducer';
import openCourseFormReducer from './openCourseFormReducer';
import redirectReducer from './redirectReducer';

const rootReducer = combineReducers({
	coursesReducer,
	authorsReducer,
	ajaxCallsReducer,
	courseFormReducer,
	authReducer,
	animationsReducer,
	openCoursesReducer,
	openCourseFormReducer,
	redirectReducer
});

export default rootReducer;
