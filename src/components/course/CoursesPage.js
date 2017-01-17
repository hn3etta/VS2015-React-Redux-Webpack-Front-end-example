import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {bindActionCreators} from 'redux';

import CourseList from './CourseList';
import ManageCoursePage from './ManageCoursePage';
import * as courseActions from '../../actions/courseActions';
import * as courseFormActions from '../../actions/courseFormActions';
import * as openCourseFormActions from '../../actions/openCourseFormActions';
import * as redirectActions from '../../actions/redirectActions';
import {formatAuthorsForDisplay} from '../../selectors/authorSelectors';
import {objectsMatch} from '../../utilities/objectUtilities';
import SideModal from '../common/SideModal';
import OpenCourseForm from '../open-course/OpenCourseForm';
import '../../styles/objects/pages/object.course-page.scss';
import '../../styles/components/pages/component.course-page.scss';

class CoursesPage extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			openCourseFound: false,
			errors: {}
		};

		/* Set context for DOM Event functions */
		this.handleAddCourseClick = this.handleAddCourseClick.bind(this);
		this.handleEditCourse = this.handleEditCourse.bind(this);
		this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
		this.handleShowOpenCourseFormModal = this.handleShowOpenCourseFormModal.bind(this);
	}

	/* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
	shouldComponentUpdate(nextProps, nextState) {
		// Check if the new props/state are different the current props/state
		if (!nextProps.immtblCoursesCntr.equals(this.props.immtblCoursesCntr)) {
			return true;
		}

		if (!nextProps.authors.equals(this.props.authors)) {
			return true;
		}

		if (!nextProps.courseModal.equals(this.props.courseModal)) {
			return true;
		}

		if (!nextProps.openCourseModal.equals(this.props.openCourseModal)) {
			return true;
		}

		if (!nextProps.immtblUsr.equals(this.props.immtblUsr)) {
			return true;
		}

		if (nextProps.loading !== this.props.loading) {
			return true;
		}

		if (!objectsMatch(nextState, this.state)) {
			return true;
		}

		return false;
	}

	componentWillUpdate(nextProps) {
		// Check if user is authenticated
		if (nextProps.immtblUsr.get('isAuthenticated') === false) {
			const {location} = this.props;
			// Save this page route for post-auth redirect
			this.props.redirectActions.postAuthRedirect(location.pathname);
			// Push user to the login.  Not using browserHistory so when users'
			// click back they don't navigate to the login page.
			this.props.router.push('/login');
		}
	}

	handleAddCourseClick(event) {
		console.log('add course clicked!');
		event.preventDefault();
		if (this.props.courseModal.get('open')) {
			this.props.courseFormActions.closeCourseFormScreen();
		} else {
			this.props.courseFormActions.openCourseFormScreen('');
		}
	}

	handleEditCourse(courseId) {
		this.props.courseFormActions.openCourseFormScreen(courseId);
	}

	handleDeleteCourse(courseId) {
		this.props.courseActions.handleDeleteCourse(courseId);
	}

	handleShowOpenCourseFormModal(courseId) {
		this.props.openCourseFormActions.openCourseIsOpenFormScreen(courseId);
	}

	render() {
		const {immtblCoursesCntr, authors, courseModal, openCourseModal} = this.props; /* Destructure objects for easier rendering code (readability) */
		return (
			<div className="course-page">
				<div className="course-page__sidebar">
					<a
						href="/course"
						className="course-page__add-btn"
						onClick={this.handleAddCourseClick}
					>
						Add a Course
					</a>
				</div>
				<SideModal
					cssClassName="side-modal-left"
					isOpen={courseModal.get('open')}
				>
					<ManageCoursePage/>
				</SideModal>
				<SideModal
					cssClassName="side-modal-right"
					location="right"
					isOpen={openCourseModal.get('open')}
				>
					<OpenCourseForm/>
				</SideModal>
				<div className="course-page__main-cntr">
					<div className="course-page__main">
						<h1 className="course-page__title">Courses</h1>
						<CourseList
							courses={immtblCoursesCntr.get('allCourses')}
							allAuthors={authors}
							onEdit={this.handleEditCourse}
							onDelete={this.handleDeleteCourse}
							onEditOpenCourse={this.handleShowOpenCourseFormModal}
						/>
					</div>
				</div>
			</div>
		);
	}
}

/* Component Validation */
CoursesPage.propTypes = {
	immtblCoursesCntr: ImmutablePropTypes.map,
	authors: ImmutablePropTypes.list,
	courseModal: ImmutablePropTypes.map,
	openCourseModal: ImmutablePropTypes.map,
	immtblUsr: ImmutablePropTypes.map,
	loading: PropTypes.bool.isRequired,
	courseActions: PropTypes.object.isRequired,
	courseFormActions: PropTypes.object.isRequired,
	openCourseFormActions: PropTypes.object.isRequired,
	redirectActions: PropTypes.object.isRequired,
	/* React Router */
	router: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

/* Redux connect and related functions */
function mapStateToProps(state) {
	return {
		immtblCoursesCntr: state.coursesReducer.coursesCntr,
		authors: formatAuthorsForDisplay(state.authorsReducer.authorsCntr.get('allAuthors')),
		courseModal: state.courseFormReducer.modalData,
		openCourseModal: state.openCourseFormReducer.modalData,
		immtblUsr: state.authReducer.user,
		loading: state.ajaxCallsReducer.ajaxCallsInProgress > 0
	};
}

function mapDispatchToProps(dispatch) {
	return {
		courseActions: bindActionCreators(courseActions, dispatch),  // bindActionCreators automatically wraps courseActions with dispathes
		courseFormActions: bindActionCreators(courseFormActions, dispatch),
		redirectActions: bindActionCreators(redirectActions, dispatch),
		openCourseFormActions: bindActionCreators(openCourseFormActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CoursesPage));  // Connect is a higher order component
