import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import TextInput from '../common/TextInput';
import BooleanLinks from '../common/BooleanLinks';
import * as openCourseActions from '../../actions/openCourseActions';
import * as openCourseFormActions from '../../actions/openCourseFormActions';
import initOpenCourse from '../../initModels/initialOpenCourseState';
import '../../styles/objects/pages/object.open-course-form.scss';
import '../../styles/components/pages/component.open-course-form.scss';

class OpenCourseForm extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			open: false,
			openCourse: Object.assign({}, initOpenCourse),
			courseName: '',
			errors: {}
		};

		this.openCourseStatusChangeToOpen = this.openCourseStatusChangeToOpen.bind(this);
		this.openCourseStatusChangeToClosed = this.openCourseStatusChangeToClosed.bind(this);
		this.handleMaxAttendeesState = this.handleMaxAttendeesState.bind(this);
		this.handleOpenCourseStatusChangeSave = this.handleOpenCourseStatusChangeSave.bind(this);
		this.handleOpenCourseStatusChangeCancel = this.handleOpenCourseStatusChangeCancel.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		// Course status click change detected
		if (typeof nextProps.openCourseModal.get('courseId') === 'number') {
			// Skip state update if Ajax progress true
			if (nextProps.loading) {
				return;
			}

			// Determine if the last data pull for OpenCourses has the "clicked" course status id in it
			const openCourseMatch = nextProps.immtblOpenCoursesList.find(ocCntr => ocCntr.get('openCourse').get('courseId') === nextProps.openCourseModal.get('courseId'));

			if (openCourseMatch) {
				const openCourse = Object.assign({}, this.state.openCourse);
				openCourse.id = openCourseMatch.get('openCourse').get('id');
				openCourse.courseId = openCourseMatch.get('openCourse').get('courseId');
				openCourse.maxAttendees = openCourseMatch.get('openCourse').get('maxAttendees');
				const courseName = openCourseMatch.get('courseName');
				this.setState({openCourse, courseName, open: true});
			} else {
				this.setState({openCourse: initOpenCourse, open: false});
			}
		} else {
			this.setState({open: false});
		}
	}

	openCourseStatusChangeToOpen(event) {
		event.preventDefault();

		this.setState({open: true});
	}

	openCourseStatusChangeToClosed(event) {
		event.preventDefault();

		this.setState({open: false});
	}

    // update the state which holds the latest input values
	handleMaxAttendeesState(event) {
		const openCourse = Object.assign({}, this.state.openCourse);
		const errors = Object.assign({}, this.state.errors);
		const field = event.target.name;
		const valNumber = parseInt(event.target.value, 10);

		if (typeof valNumber === 'number' && valNumber > 0) {
			openCourse[field] = valNumber.toString();
			errors[field] = undefined;
		} else {
			openCourse[field] = '1';
			errors[field] = 'Value needs to be a number and at least a value of 1';
		}

		return this.setState({openCourse, errors});
	}

	handleOpenCourseStatusChangeSave(event) {
		event.preventDefault();

		if (this.state.open) {
			this.props.openCourseActions.saveOpenCourse(Object.assign({}, this.state.openCourse, {courseId: this.props.openCourseModal.get('courseId')}));
		} else {
			// Find the current openCourseCntr (that has the openCourse id) that matches the current openCourse modal courseId
			const openCourseCntr = this.props.immtblOpenCoursesList.find(
				openCourseCntr => openCourseCntr.get('openCourse').get('courseId') === this.props.openCourseModal.get('courseId')
			);
			this.props.openCourseActions.deleteOpenCourse(openCourseCntr.get('openCourse').get('id'), openCourseCntr.get('openCourse').get('courseId'));
		}
	}

	handleOpenCourseStatusChangeCancel(event) {
		event.preventDefault();

		this.props.openCourseFormActions.closeCourseIsOpenFormScreen();
	}

	render() {
		return (
			<form className="open-course-form">
				<h1 className="open-course-form__title">
					Open Course Settings
				</h1>
				<div className="open-course-form__course-name-cntr">
					<div className="open-course-form__course-name-cntr__label">
						Course Title
					</div>
					<div className="open-course-form__course-name-cntr__title">
						{this.state.courseName}
					</div>
				</div>
				<BooleanLinks
					containerCssClass="open-course-form__input-cntr"
					labelCssClass="open-course-form__status-label"
					labelText="Status"
					trueCssClass="open-course-form__status-open"
					trueText="Open"
					trueClick={this.openCourseStatusChangeToOpen}
					falseCssClass="open-course-form__status-closed"
					falseText="Closed"
					falseClick={this.openCourseStatusChangeToClosed}
					trueSelected={this.state.open}
					selectedCssModifier="--isTrue"
				/>

				<TextInput
					type="text"
					name="maxAttendees"
					label="Max Attendees"
					value={this.state.openCourse.maxAttendees.toString()}
					onChange={this.handleMaxAttendeesState}
					error={this.state.errors.maxAttendees}
					disabled={!this.state.open}
					containerCssClass="open-course-form__input-cntr"
					labelCssClass="open-course-form__attendees-label"
					inputCssClass="open-course-form__attendees-input"
					errorCssClass="open-course-form__attendees-error"
				/>

				<div className="open-course-form__button-cntr">
					<a
						href="#"
						className="open-course-form__save-btn"
						onClick={this.handleOpenCourseStatusChangeSave}
					>
						{this.props.loading ? 'Saving' : 'Save'}
						{this.props.loading && <div className="busyAnimation"/>}
					</a>

					<a
						href="#"
						className="open-course-form__cancel-btn"
						onClick={this.handleOpenCourseStatusChangeCancel}
					>
						Cancel
					</a>
				</div>
			</form>
		);
	}
}

OpenCourseForm.propTypes = {
	openCourseModal: ImmutablePropTypes.map,
	immtblOpenCoursesList: ImmutablePropTypes.list,
	loading: PropTypes.bool,
	openCourseActions: PropTypes.object.isRequired,
	openCourseFormActions: PropTypes.object.isRequired
};

/* Redux connect and related functions */
function mapStateToProps(state) {
	return {
		openCourseModal: state.openCourseFormReducer.modalData,
		immtblOpenCoursesList: state.openCoursesReducer.openCoursesCntr.get('allOpenCourses'),
		loading: state.ajaxCallsReducer.ajaxCallsInProgress > 0
	};
}

function mapDispatchToProps(dispatch) {
	return {
		openCourseActions: bindActionCreators(openCourseActions, dispatch),
		openCourseFormActions: bindActionCreators(openCourseFormActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenCourseForm);
