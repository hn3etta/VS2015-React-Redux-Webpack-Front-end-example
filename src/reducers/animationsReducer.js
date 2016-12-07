import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialAnimationsState';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;


//const initialState = Map(initAnimState);

export default function animationsReducer(state = initialState, action) {

    switch (action.type) {
        case types.LOGIN_PAGE_INITIAL_ANIMATION:
            return { animationSettings: state.animationSettings.set("loginDisplay", false) };
    }

    return state;
}