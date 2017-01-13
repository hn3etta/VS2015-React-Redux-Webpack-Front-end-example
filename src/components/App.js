import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Header from './common/Header';
import * as authActions from '../actions/authenticationActions';

class App extends Component {
	render() {
		return (
			<div className="app-container">
				<Header
					loading={this.props.loading}
					isAuthd={this.props.userAuthd}
				/>
				{this.props.children}
			</div>
		);
	}
}

App.propTypes = {
	children: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	userAuthd: PropTypes.bool
};

function mapStateToProps(state) {
	return {
        /* Get state's ajaxCallsInProgress and convert to boolean */
		loading: state.ajaxCallsReducer.ajaxCallsInProgress > 0,
		userAuthd: state.authReducer.user.get('isAuthenticated')
	};
}

// Map courseActions to dispatch events
function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
