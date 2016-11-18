import * as types from './actionTypes';

export function openScreen(modalData) {
    return { type: types.OPEN_COURSE_SCREEN, modalData };
}

export function closeScreen(modalData) {
    return { type: types.CLOSE_COURSE_SCREEN, modalData };
}
