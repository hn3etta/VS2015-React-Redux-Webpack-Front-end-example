import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialCourseModalState';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;


export default function courseFormReducer(state = initialState, action) {

    switch (action.type) {
        case types.OPEN_COURSE_SCREEN:
        case types.CLOSE_COURSE_SCREEN:
            return { modalData: state.modalData.merge(action.modalData) };

    }

    return state;
}