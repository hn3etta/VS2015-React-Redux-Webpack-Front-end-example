import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialAuthorsState';

/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;

/* Reducers should always return a new array/object.  Never manipulate state directly */
export default function authorsReducers(state = initialState, action) {
    switch (action.type) {
        case types.LOAD_AUTHORS_SUCCESS:
            return {
                authorsCntr: state.authorsCntr.withMutations(authorCntr => {
                    authorCntr.set("allAuthors", authorCntr.get("allAuthors")
                                                           .merge(action.loadedAuthorsCntr.allAuthors))
                              .set("statusText", action.loadedAuthorsCntr.statusText)
                              .set("ajaxStart", action.loadedAuthorsCntr.ajaxStart)
                              .set("ajaxEnd", action.loadedAuthorsCntr.ajaxEnd);
                })
            };
        case types.LOAD_AUTHORS_ERROR:
            return {
                authorsCntr: state.authorsCntr.withMutations(authorCntr => {
                    authorCntr.set("statusText", action.loadedAuthorsErrorCntr.statusText)
                              .set("ajaxStart", action.loadedAuthorsErrorCntr.ajaxStart)
                              .set("ajaxEnd", action.loadedAuthorsErrorCntr.ajaxEnd);
                })
            };
        default:
            return state;
    }
}