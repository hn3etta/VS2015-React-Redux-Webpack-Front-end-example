import moment from 'moment';
import {createStore, applyMiddleware, compose} from 'redux';
import {autoRehydrate, persistStore} from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';
import immutableTransform from 'redux-persist-transform-immutable';
import thunk from 'redux-thunk';

import {logoffUser, userStillAuthenticated} from '../actions/authenticationActions';
import {loadAuthors} from '../actions/authorActions';
import {loadCourses} from '../actions/courseActions';
import rootReducer from '../reducers';

const encryptor = createEncryptor({
	secretKey: 'amirdxstrk-1t01z-1652-rvl'
});

export default function configureStore(initialState) {
	const store = createStore(rootReducer, initialState, compose(
		applyMiddleware(thunk),
		autoRehydrate()
	));
	// Persist the Redux store for user authenticated data only and
	// execute anonymous callback function after store is saturated
	persistStore(store, {whitelist: ['authReducer'], transforms: [immutableTransform({encryptor})]}, () => {
		// Fetch the current user's immutable object
		const immtblUsr = store.getState().authReducer.user;

		if (!immtblUsr.get('isAuthenticated')) {
			store.dispatch(logoffUser(immtblUsr));
			return;
		}

		// Check if the user's last authenticated ajax request (datetime) and
		// JWT authentication token expires (in seconds) are still valid
		if (moment(immtblUsr.get('ajaxEnd'), 'YYYY-MM-DD:HH:mm:ss.SSS').add(immtblUsr.get('authExpiresIn'), 's').isAfter(moment())) {
			// User's bearer token is valid so perform all AJAX requests needed for authd user
			store.dispatch(userStillAuthenticated());
			store.dispatch(loadAuthors());
			store.dispatch(loadCourses());
		} else {
			// User's token is invalid - force a login
			store.dispatch(logoffUser(immtblUsr));
		}
	});
	return store;
}
