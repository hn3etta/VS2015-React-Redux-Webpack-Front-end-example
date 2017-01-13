import React, {Component, PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';

import {GetRoutes} from '../routes';
import '../styles/components/component.app.scss';
import '../styles/objects/object.app.scss';

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182

class Root extends Component {
	render() {
		const {store} = this.props;
		return (
			<Provider store={store}>
				<Router history={browserHistory}>
					{GetRoutes(store)}
				</Router>
			</Provider>
		);
	}
}

Root.propTypes = {
	store: PropTypes.object.isRequired
};

export default Root;
