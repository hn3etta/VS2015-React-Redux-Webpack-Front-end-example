import * as types from '../actions/actionTypes';
import initialState from '../initModels/initialRedirectState';

/* Use "require" for non ES6 Modules */


export default function redirectReducer(state = initialState, action) {

    switch (action.type) {
        case types.POST_AUTH_REDIRECT_PATH:
            return { redirectOptions: state.redirectOptions.set("postAuthPath", action.newPathName) };
    }

    return state;
}