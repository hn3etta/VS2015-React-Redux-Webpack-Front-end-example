import * as types from './actionTypes';

export function beginAjaxCall(ajaxCallsInProgress) {
	return {type: types.BEGIN_AJAX_CALL, ajaxCallsInProgress};
}
