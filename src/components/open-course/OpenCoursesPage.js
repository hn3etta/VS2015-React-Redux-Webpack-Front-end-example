import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {bindActionCreators} from 'redux';

import OpenClassTile from './OpenClassTile';
import * as openCourseActions from '../../actions/openCourseActions';
import * as redirectActions from '../../actions/redirectActions';
import attendeeIcon from '../../images/attendee.png';
import emptyDeskIcon from '../../images/attendee_empty.png';
import maxAttendeeIcon from '../../images/max-attendee.png';
import addIcon from '../../images/add-icon.png';
import subtractIcon from '../../images/subtract-icon.png';
import initOpenCourseTimeoutObj from '../../initModels/initialOpenCourseTimeoutObj';
import {objectsMatch} from '../../utilities/objectUtilities';
import UIDelays from '../../utilities/uiDelays';
import '../../styles/objects/pages/object.open-courses-page.scss';
import '../../styles/components/pages/component.open-courses-page.scss';

class OpenCoursesPage extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			updatedMsgIntrvlHndl: undefined,
			openCoursesRefreshArr: [],
			intervalSeconds: 10
		};

		/* Set context for DOM Event functions */
		this.loadOCRefreshes = this.loadOCRefreshes.bind(this);
		this.intervalExe = this.intervalExe.bind(this);
		this.saveOpenCourseRefreshSeconds = this.saveOpenCourseRefreshSeconds.bind(this);
	}

	componentWillMount() {
	}

	componentWillReceiveProps(nextProps) {
		// Update the state only when the coursesCntr's course objects have changed
		if (!nextProps.immtblOpenCoursesList.equals(this.props.immtblOpenCoursesList)) {
			this.loadOCRefreshes(nextProps.immtblOpenCoursesList);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		// Check if the new props/state are different the current props/state
		if (!nextProps.immtblOpenCoursesList.equals(this.props.immtblOpenCoursesList)) {
			return true;
		}

		if (!objectsMatch(nextState, this.state)) {
			return true;
		}

		if (!nextProps.immtblUsr.equals(this.props.immtblUsr)) {
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

	componentWillUnmount() {
		// Clear "Updated" message update interval
		if (typeof this.state.updatedMsgIntrvlHndl !== 'undefined') {
			clearInterval(this.state.updatedMsgIntrvlHndl);
			this.setState({updatedMsgIntrvlHndl: undefined});
		}

		// Clear all "Open Course" refresh intervals by looping over the openCoursesRefreshArr properties
		this.state.openCoursesRefreshArr.forEach(ocRfrshObj => {
			if (ocRfrshObj.timeoutHndl > 0) {
				clearTimeout(ocRfrshObj.timeoutHndl);
			}
		});
	}

	// Process all Open Courses that are not "updating" and have a "refreshSeconds" value greater than zero
	loadOCRefreshes(immtblOpenCoursesList) {
		let ocRfrshTimeoutObjs = [...this.state.openCoursesRefreshArr];
		const ocFound = immtblOpenCoursesList.size > 0;

		// Filter out the "updating" and zero "refreshSeconds" diffCntrs and Enumerate over remaining diffCntrs
		immtblOpenCoursesList
			.filter(ocCntr => !ocCntr.get('updating') && ocCntr.get('refreshSeconds') > 0)
			.forEach(ocCntr => {
				const oc = ocCntr.get('openCourse');
				// Find exisitng refresh timeout object for this diffCntr
				const fndRfrshObj = ocRfrshTimeoutObjs.find(ocRfrshTOObj => ocRfrshTOObj.id === oc.get('id'));
				// If open course refresh object not found then create a new open course refresh object
				const refreshObj = fndRfrshObj ? fndRfrshObj : Object.assign({}, initOpenCourseTimeoutObj, {id: oc.get('id')});

				if (
					(typeof refreshObj.timeoutHndl === 'undefined' || ocCntr.get('refreshSeconds') !== refreshObj.secsRefresh) &&
					(typeof ocRfrshTimeoutObjs.find(ocRTO => ocRTO.id === refreshObj.id) === 'undefined')
				) {
					ocRfrshTimeoutObjs = [
						...ocRfrshTimeoutObjs,
						Object.assign({}, refreshObj, {
							secsRefresh: ocCntr.get('refreshSeconds'),
							timeoutHndl: setTimeout(this.intervalExe.bind(this, refreshObj.id), ocCntr.get('refreshSeconds') * 1000)
						})
					];
				} else {
					ocRfrshTimeoutObjs = ocRfrshTimeoutObjs.map(ocRTO => {
						if (ocRTO.id === refreshObj.id) {
							if (typeof refreshObj.timeoutHndl === 'undefined') {
								refreshObj.timeoutHndl = setTimeout(this.intervalExe.bind(this, refreshObj.id), ocCntr.get('refreshSeconds') * 1000);
							}

							return refreshObj;
						}
						return ocRTO;
					});
				}
			}, this);

		// The following is to limit the number of setStates
		if (typeof this.state.updatedMsgIntrvlHndl === 'undefined' && ocFound) {
			// Set Timeout handle for updating the "Updated" time message
			this.setState({
				openCoursesRefreshArr: ocRfrshTimeoutObjs,
				updatedMsgIntrvlHndl: setInterval(() => {
					// Send action to update open course's "Updated" message
					this.props.openCourseActions.internalUpdateOpenCourseMsg();
				}, UIDelays.updatedMessage)
			});
		} else {
			this.setState({
				openCoursesRefreshArr: ocRfrshTimeoutObjs
			});
		}
	}

	intervalExe(openCourseId) {
		// Clear ope course's interval for AJAX calls.  Don't know how long AJAX will take to complete
		this.setState({
			openCoursesRefreshArr: this.state.openCoursesRefreshArr.map(ocRefreshObj => {
				if (ocRefreshObj.id === openCourseId) {
					clearTimeout(ocRefreshObj.timeoutHndl);
					ocRefreshObj.timeoutHndl = undefined;
				}
				return ocRefreshObj;
			})
		});

		// Send synchronous action for open course updating
		this.props.openCourseActions.internalUpdateOpenCourseIsUpdating(openCourseId);

		// Send asynchronous action to trigger AJAX update for the open course
		this.props.openCourseActions.refreshOpenCourse(openCourseId);
	}

	saveOpenCourseRefreshSeconds(openCourseId, nbrOperation) {
		let newSeconds = nbrOperation > 0 ? nbrOperation : 0;

		// Find ocRefreshObj by openCourseId, clear any timeouts and set new "seconds" value and init timeout handle
		this.setState({
			openCoursesRefreshArr: this.state.openCoursesRefreshArr.map(ocRefreshObj => {
				if (ocRefreshObj.id === openCourseId) {
					clearTimeout(ocRefreshObj.timeoutHndl);
					newSeconds = ocRefreshObj.secsRefresh + nbrOperation > 0 ? ocRefreshObj.secsRefresh + nbrOperation : 0;
					ocRefreshObj.secsRefresh = newSeconds;
					ocRefreshObj.timeoutHndl = undefined;
				}
				return ocRefreshObj;
			})
		});

		// Send synchronous action for changing open course's seconds value
		this.props.openCourseActions.internalUpdateOpenCourseSecs({openCourseId, seconds: newSeconds});
	}

	render() {
		const openCourseCntrs = this.props.immtblOpenCoursesList;
		return (
			<div className="open-courses-page">
				<h1 className="open-courses-page__title">
					Open Courses Status (Simulator)
				</h1>
				<div className="open-courses-page__container">
					{openCourseCntrs.map(immtblOpenCourseCntr =>
						<OpenClassTile
							key={immtblOpenCourseCntr.get('openCourse').get('id')}
							attendeeIcon={attendeeIcon}
							emptyDeskIcon={emptyDeskIcon}
							maxAttendeeIcon={maxAttendeeIcon}
							addIcon={addIcon}
							subtractIcon={subtractIcon}
							immtblOpenCourse={immtblOpenCourseCntr.get('openCourse')}
							immtblOpenCourseCntr={immtblOpenCourseCntr}
							openCourseRefreshSecondsChange={this.saveOpenCourseRefreshSeconds}
							refreshSecsInterval={this.state.intervalSeconds}
						/>
					)}
				</div>
			</div>
		);
	}

}

/* Component Validation */
OpenCoursesPage.propTypes = {
	immtblUsr: ImmutablePropTypes.map,
	immtblOpenCoursesList: ImmutablePropTypes.list,
	openCourseActions: PropTypes.object.isRequired,
	redirectActions: PropTypes.object.isRequired,
	router: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired
};

/* Redux connect and related functions */
function mapStateToProps(state) {
	return {
		immtblUsr: state.authReducer.user,
		immtblCoursesList: state.coursesReducer.coursesCntr.get('allCourses'),
		immtblOpenCoursesList: state.openCoursesReducer.openCoursesCntr.get('allOpenCourses')
	};
}

function mapDispatchToProps(dispatch) {
	return {
		openCourseActions: bindActionCreators(openCourseActions, dispatch),
		redirectActions: bindActionCreators(redirectActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(OpenCoursesPage));  // Connect is a higher order component
