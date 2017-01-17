import {Map} from 'immutable';

export default {
	openCourseCntr: Map({
		openCourse: undefined,
		courseName: '',
		refreshSeconds: 0,
		statusText: '',
		ajaxStart: undefined,
		ajaxEnd: undefined,
		animateChart: false,
		updating: false,
		updatedMsg: undefined
	})
};
