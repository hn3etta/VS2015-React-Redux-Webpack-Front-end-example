import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialAuthorsState';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;

/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function authorsReducers(state = initialState, action) {
    switch (action.type) {
        case types.LOAD_AUTHORS_SUCCESS:
        case types.LOAD_AUTHORS_ERROR:
            return { authorsCntr: state.authorsCntr.merge(action.immtblAuthorsCntr) };

        default:
            return state;
    }
}