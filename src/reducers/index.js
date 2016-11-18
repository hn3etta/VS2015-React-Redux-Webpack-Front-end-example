import {combineReducers} from 'redux';
import coursesReducer from './coursesReducer';
import authorsReducer from './authorsReducer';
import ajaxCallsReducer from './ajaxStatusReducer';
import courseFormReducer from './courseFormReducer';
import authReducer from './authenticationReducer';
import animationsReducer from './animationsReducer';
import openCoursesReducer from './openCoursesReducer';
import redirectReducer from './redirectReducer';

const rootReducer = combineReducers({
    coursesReducer, // ES2015 can consolidate "coursesReducer: coursesReducer" to just "coursesReducer" (short-hand property name).
    authorsReducer,
    ajaxCallsReducer,
    courseFormReducer,
    authReducer,
    animationsReducer,
    openCoursesReducer,
    redirectReducer
});

export default rootReducer;