import * as types from './actionTypes';

export function postAuthRedirect(newPathName) {
    return { type: types.POST_AUTH_REDIRECT_PATH, newPathName };
}
