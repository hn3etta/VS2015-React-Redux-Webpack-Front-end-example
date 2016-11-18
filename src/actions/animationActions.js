import * as types from './actionTypes';

export function loginAnimation(animationSettings) {
    return { type: types.LOGIN_PAGE_INITIAL_ANIMATION, animationSettings };
}
