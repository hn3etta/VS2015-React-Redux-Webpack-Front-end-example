import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {browserHistory, withRouter} from 'react-router';
import {bindActionCreators} from 'redux';
import {TweenLite} from 'gsap';

import TextInput from '../common/TextInput';
import * as animationActions from '../../actions/animationActions';
import * as authenticationActions from '../../actions/authenticationActions';
import * as redirectActions from '../../actions/redirectActions';
import userErrors from '../../error-messages/userFormErrors';
import {objectsMatch} from '../../utilities/objectUtilities';
import UIDelays from '../../utilities/uiDelays';
import '../../styles/objects/pages/object.login-page.scss';
import '../../styles/components/pages/component.login-page.scss';

class LoginPage extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			username: '',
			password: '',
			errors: {},
			displayError: false,
			errorTimeout: undefined
		};

		/* Set context for DOM Event functions */
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleErrorMsgClose = this.handleErrorMsgClose.bind(this);
		this.vaidateSubmit = this.vaidateSubmit.bind(this);
		this.userChangesDetected = this.userChangesDetected.bind(this);
		this.showError = this.showError.bind(this);
	}

	componentWillMount() {
		if (this.props.immtblUsr.get('isAuthenticated')) {
			this.props.router.push('/');
		}
	}

	componentDidMount() {
		if (this.props.animationSettings.get('loginDisplay')) {
			TweenLite.fromTo(this.loginContainer, 0.5, {y: -1000, opacity: 0}, {y: 0, opacity: 1});

			this.props.animActions.loginAnimation();
		} else {
			TweenLite.fromTo(this.loginContainer, 0.5, {opacity: 0}, {opacity: 1});
		}
	}

	/* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
	shouldComponentUpdate(nextProps, nextState) {
		// Check if the new props/state are different the current props/state
		if (!nextProps.immtblUsr.equals(this.props.immtblUsr)) {
			return true;
		}

		if (!nextProps.animationSettings.equals(this.props.animationSettings)) {
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
		if (!nextProps.immtblUsr.equals(this.props.immtblUsr)) {
			this.userChangesDetected(nextProps.immtblUsr);
		}
	}

	componentWillUnmount() {
		if (this.state.errorTimeout) {
			clearTimeout(this.state.errorTimeout);
		}
	}

	userChangesDetected(immtblUsr) {
		// if immtblUsr is authenticated then redirect
		if (immtblUsr.get('isAuthenticated')) {
			if (this.props.postAuthRedirect.length > 0) {
				// Clear the page route for post-auth redirect
				this.props.redirectActions.postAuthRedirect('');

				browserHistory.push(this.props.postAuthRedirect);
				return;
			}

			browserHistory.push('/');
			return;
		}

		// if async login error hit
		if (immtblUsr.get('statusText')) {
			this.showError(immtblUsr.get('statusText'));
		}
	}

	showError(errorMessage) {
		// Set Timeout for hiding the error message
		const timeoutHandle = setTimeout(() => {
			this.setState({
				displayError: false,
				errorTimeout: undefined
			});
		}, UIDelays.errorDisplay);

		this.setState({
			displayError: errorMessage,
			errorTimeout: timeoutHandle
		});
	}

	/*
	 *
	 * UI helpers for messages, CSS, state changes and form validation/submission
	 *
	 */

	// Handle button text for adding or saving courses
	getMessage(loadStatus) {
		const msg = 'Login';

		if (loadStatus) {
			return 'Logging in';
		}

		return msg;
	}

	// update the state which holds the latest input values
	handleChange(event) {
		event.preventDefault();
		// Set the state for the edited input element
		return this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleKeyPress(event) {
		if (event.key === 'Enter') {
			this.vaidateSubmit();
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		this.vaidateSubmit();
	}

	handleCancel(event) {
		event.preventDefault();
		browserHistory.push('/');
	}

	handleErrorMsgClose(event) {
		event.preventDefault();

		clearTimeout(this.state.errorTimeout);

		this.setState({
			displayError: false,
			errorTimeout: undefined
		});
	}

	vaidateSubmit() {
		// If another UI api call in progress then skip
		if (this.loginFormValid() && !this.props.loading) {
			// Fire authentication API call.  (fire and forget)
			this.props.authActions.authenticateUser(this.state.username, this.state.password, this.props.immtblUsr);
		}
	}

	loginFormValid() {
		let isValid = true;
		const errors = {};
		// enumerate over userError properties to validate current state
		for (const errorProp in userErrors) {
			// If an error exists for this property and the course prop is undefined or empty
			if (typeof this.state[errorProp] === 'undefined' || this.state[errorProp] === userErrors[errorProp].emptyVal) {
				errors[errorProp] = userErrors[errorProp].errorMessage;
				isValid = false;
			}
		}
		this.setState({errors});
		return isValid;
	}

	render() {
		const focus = true;
		return (
			<div className="login-page">
				<div ref={e => this.loginContainer = e} className="login-page__container">
					<h1 className="login-page__title">
						Login
					</h1>
					<p className="login-page__desc">
						Please login with the username &apos;test@test.com&apos; and a password of &apos;Password&apos;.
					</p>
					<TextInput
						type="text"
						name="username"
						label="Username"
						focus={focus}
						value={this.state.username}
						placeholder="Username"
						onChange={this.handleChange}
						error={this.state.errors.username}
						containerCssClass="login-page__username-input-cntr"
						labelCssClass="login-page__username-input-label"
						inputCssClass="login-page__username-input"
						errorCssClass="login-page__username-error"
					/>

					<TextInput
						type="password"
						name="password"
						label="Password"
						value={this.state.password}
						placeholder="Password"
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
						error={this.state.errors.password}
						containerCssClass="login-page__password-input-cntr"
						labelCssClass="login-page__password-input-label"
						inputCssClass="login-page__password-input"
						errorCssClass="login-page__password-error"
					/>

					<div className="login-page__button-cntr">
						<a
							href="login"
							className={this.props.loading ? 'login-page__action-btn login-page__action-btn--busy' : 'login-page__action-btn'}
							onClick={this.handleSubmit}
						>
							{this.getMessage(this.props.loading)}
							{this.props.loading && <div className="busyAnimation"/>}
						</a>

						<a
							href="cancel"
							className="login-page__cancel-btn"
							onClick={this.handleCancel}
						>
							Cancel
						</a>
					</div>
					<div className={this.state.displayError ? 'login-page__error-cntr trnsQtrSec login-page__error-cntr--open' : 'login-page__error-cntr trnsQtrSec'}>
						<p className="login-page__error-msg">
							{this.props.immtblUsr.get('statusText')}
						</p>
						<a href="dismiss" onClick={this.handleErrorMsgClose} className="login-page__error-close">
							<div className="login-page__error-close-icon"/>
						</a>
					</div>
				</div>
			</div>
		);
	}
}

LoginPage.propTypes = {
	authActions: PropTypes.object.isRequired,
	animActions: PropTypes.object.isRequired,
	redirectActions: PropTypes.object.isRequired,
	immtblUsr: ImmutablePropTypes.map,
	loading: PropTypes.bool.isRequired,
	animationSettings: PropTypes.object.isRequired,
	postAuthRedirect: PropTypes.string.isRequired,
	router: PropTypes.object.isRequired
};

/* Redux connect and related functions */
function mapStateToProps(state) {
	return {
		immtblUsr: state.authReducer.user,
		loading: state.ajaxCallsReducer.ajaxCallsInProgress > 0,
		animationSettings: state.animationsReducer.animationSettings,
		postAuthRedirect: state.redirectReducer.redirectOptions.get('postAuthPath')
	};
}

// Map courseActions to dispatch events
function mapDispatchToProps(dispatch) {
	return {
		authActions: bindActionCreators(authenticationActions, dispatch),
		animActions: bindActionCreators(animationActions, dispatch),
		redirectActions: bindActionCreators(redirectActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginPage));
