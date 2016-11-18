import {bindActionCreators} from 'redux';

/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;
let connect = require('react-redux').connect;

import Header from './common/Header';
// Action creators
import * as authActions from '../actions/authenticationActions';


class App extends React.Component {
    render() {
        return (
            <div className="app-container">
                <Header loading={this.props.loading}
                        isAuthd={this.props.userAuthd} />
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

function mapStateToProps(state, ownProps) {
    return {
        /* Get state's ajaxCallsInProgress and convert to boolean */
        loading: state.ajaxCallsReducer.ajaxCallsInProgress > 0,
        userAuthd: state.authReducer.user.get("isAuthenticated")
    };
}

// Map courseActions to dispatch events
function mapDispatchToProps(dispatch) {
    return {
        authActions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);