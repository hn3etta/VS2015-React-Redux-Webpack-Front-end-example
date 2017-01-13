import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {bindActionCreators} from 'redux';

import * as authenticationActions from '../../actions/authenticationActions';
import {objectsMatch} from '../../utilities/objectUtilities';
import '../../styles/objects/pages/object.logoff-page.scss';
import '../../styles/components/pages/component.logoff-page.scss';

class LogoffPage extends Component {

	componentWillMount() {
		// If the user is already not logged it, kick back to the home screen
		if (!this.props.immtblUsr.get('isAuthenticated')) {
			browserHistory.push('/');
		}
	}

	componentDidMount() {
		this.props.authActions.logoffUser(this.props.immtblUsr);
	}

	/* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
	shouldComponentUpdate(nextProps, nextState) {
		// Check if the new props/state are different the current props/state
		if (!nextProps.immtblUsr.equals(this.props.immtblUsr)) {
			return true;
		}

		if (!objectsMatch(nextState, this.state)) {
			return true;
		}

		return false;
	}

	/* React lifecycle function - exeuctes anytime props might have changed (or React thinks it has changed) */
	componentWillUpdate() {
		browserHistory.push('/');
	}

	render() {
		return (
			<div className="logoff-page">
				<div className="logoff-page__container">
					<h1 className="logoff-page__title">
						Logging off
					</h1>
					<p className="logoff-page__desc">
						Please wait.
					</p>
				</div>
			</div>
		);
	}
}

LogoffPage.propTypes = {
	authActions: PropTypes.object.isRequired,
	immtblUsr: ImmutablePropTypes.map
};

/* Redux connect and related functions */
function mapStateToProps(state) {
	return {
		immtblUsr: state.authReducer.user
	};
}

// Map courseActions to dispatch events
function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authenticationActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoffPage);
