import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import moment from 'moment';

/* Use "require" for non ES6 Modules */
let persistStore = require('redux-persist').persistStore;
let autoRehydrate = require('redux-persist').autoRehydrate;
let createTransform = require('redux-persist').createTransform;
let transitInstance  = require('transit-immutable-js');
let immutableTransform = require('redux-persist-transform-immutable');
let createEncryptor = require('redux-persist-transform-encrypt');

import rootReducer from '../reducers';
// Action creators
import {loadAuthors} from '../actions/authorActions';
import {loadCourses} from '../actions/courseActions';
import {loadOpenCourses} from '../actions/openCourseActions';
import {logoffUser} from '../actions/authenticationActions';

const encryptor = createEncryptor({
    secretKey: 'amirdxstrk-1t01z-1652-rvl'
});

export default function configureStore(initialState) {
    let store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(thunk),
            autoRehydrate()
        )
    );
    // Persist the Redux store for user authenticated data only and 
    // execute anonymous callback function after store is saturated
    persistStore(store, { whitelist: ['authReducer'], transforms: [immutableTransform({ encryptor })] }, () => {
        // Fetch the current user's immutable object
        let immtblUsr = store.getState().authReducer.user;

        if (!immtblUsr.get("isAuthenticated")) {
            store.dispatch(logoffUser(immtblUsr));
            return;
        }

        // Check if the user's last authenticated ajax request (datetime) and 
        // JWT authentication token expires (in seconds) are still valid
        if (moment(immtblUsr.get("ajaxEnd"), "YYYY-MM-DD:HH:mm:ss.SSS").add(immtblUsr.get("authExpiresIn"), "s").isAfter(moment())) {
            // User's bearer token is valid so perform all AJAX requests needed for authd user
            store.dispatch(loadAuthors());
            store.dispatch(loadCourses());
            store.dispatch(loadOpenCourses());
        } else {
            // User's token is invalid - force a login
            store.dispatch(logoffUser(immtblUsr));
        }

    });
    return store;
}