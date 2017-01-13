import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Sticky from 'react-stickynode';

import UIDelays from '../utilities/uiDelays';
import {objectsMatch} from '../utilities/objectUtilities';
import '../styles/objects/containers/object.system-error-container.scss';
import '../styles/components/containers/component.system-error-container.scss';

class SystemErrorContainer extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			displayError: false,
			timeout: undefined
		};

		/* Set context for DOM Event functions */
		this.getErrorMessage = this.getErrorMessage.bind(this);
		this.handleErrorMsgClose = this.handleErrorMsgClose.bind(this);
	}

	/* React lifecycle function - exeuctes anytime props might have changed (or React thinks it has changed) */
	shouldComponentUpdate(nextProps, nextState) {
		if (this.ajaxStatusCntrsChanged(this.props, nextProps)) {
			return true;
		}

		if (!objectsMatch(nextState, this.state)) {
			return true;
		}

		return false;
	}

	componentWillUpdate(nextProps) {
		if (this.ajaxStatusCntrsChanged(this.props, nextProps)) {
			// Enumerate over the object containers to see if any have an error messages.
			// If so, then return true which then adds the object to the filter result which will increment the array count.
			// Then set the displayError state var to true for error display rendering
			if (nextProps.ajaxStatusCntrs.filter(immtblObj => {
				return immtblObj.get('statusText').length > 0;
			}).length > 0) {
				// Set Timeout for hiding the error message
				const timeoutHandle = setTimeout(() => {
					// Set state for re-rendering this component
					this.setState({
						displayError: false,
						timeout: undefined
					});
				}, UIDelays.errorDisplay);

				// Set Timeout handle to state incase component unloads
				this.setState({
					displayError: true,
					timeout: timeoutHandle
				});
			}
		}
	}

	componentWillUnmount() {
		// If timeout in process, clear it and reset the state
		if (this.state.timeout) {
			clearTimeout(this.state.timeout);
			this.setState({timeout: undefined});
		}
	}

	ajaxStatusCntrsChanged(oldProps, newProps) {
		// Enumerate over the current props object containers to see if
		// any have objects that differ from the current props.
		// If so, then return the object from the filter which will increment the array count.
		// Then a true state is returned to shouldComponentUpdate to re-render this component.
		if (oldProps.ajaxStatusCntrs.filter((immtblObj, indx) => {
			return !immtblObj.equals(newProps.ajaxStatusCntrs[indx]);
		}).length > 0) {
			return true;
		}
		return false;
	}

	getErrorMessage(errObjs) {
		// Filter the errObjs to find an object with an error messages then map a new array with the error message and return a string with "br" spacers
		return errObjs
			.filter(obj => obj.get('statusText').length > 0)
			.map(obj => obj.get('statusText'))
			.join('</br>');
	}

	handleErrorMsgClose(event) {
		event.preventDefault();

		this.setState({
			displayError: false,
			timeout: undefined
		});
	}

	render() {
		const stickyOn = true;
		return (
			<div className={this.state.displayError ? 'sys-err-cntr animQtrSec sys-err-cntr--visible' : 'sys-err-cntr animQtrSec'}>
				<Sticky enabled={stickyOn} top="sys-err-cntr" bottomBoundary="footer">
					<p className="sys-err-cntr__err-msg">
						{this.getErrorMessage(this.props.ajaxStatusCntrs)}
					</p>
					<a href="dismiss" onClick={this.handleErrorMsgClose} className="sys-err-cntr__err-dismiss">
						<div className="sys-err-cntr__err-dismiss__icon"/>
					</a>
				</Sticky>
			</div>
		);
	}
}

SystemErrorContainer.propTypes = {
	ajaxStatusCntrs: PropTypes.array.isRequired
};

/* Redux connect and related functions */
function mapStateToProps(state) {
	return {
		ajaxStatusCntrs: [
			state.authorsReducer.authorsCntr,
			state.coursesReducer.coursesCntr,
			state.openCoursesReducer.openCoursesCntr,
			...state.openCoursesReducer.openCoursesCntr.get('allOpenCourses').toArray()
		]
	};
}

export default connect(mapStateToProps)(SystemErrorContainer);
