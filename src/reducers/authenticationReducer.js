import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialUserState';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let REHYDRATE = require('redux-persist/constants');

//const initialState = Map(initUsrState);

/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function authenticationReducers(state = initialState, action) {

    /* Using switch statement since the number of cases are small */
    switch (action.type) {
        case types.USER_AUTHENTICATED:
        case types.AUTHENTICATION_ERROR:
            return { user: state.user.merge(action.immtblUsr) };
        case types.USER_LOGGED_OFF:
            return { user: state.user.set("isAuthenticated", false) };
        case types.USER_STILL_AUTHENTICATED:
            return { user: state.user.set("isAuthenticated", true) };
    }

    return state;
}