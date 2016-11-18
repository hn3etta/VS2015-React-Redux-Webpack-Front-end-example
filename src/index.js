/*eslint-disable import/default */
import 'babel-polyfill';
import configureStore from './store/configureStore';
import { Router, browserHistory } from 'react-router';
import {GetRoutes} from './routes';
import {loadCourses} from './actions/courseActions';
import {loadAuthors} from './actions/authorActions';

/* Use "require" for non ES6 Modules */
let React = require('react');
let render = require('react-dom').render;
let Provider = require('react-redux').Provider;

import './styles/components/component.app.scss';
import './styles/objects/object.app.scss';

const store = configureStore();
/* On project load */
//store.dispatch(loadCourses());
//store.dispatch(loadAuthors());

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            {GetRoutes(store)}
        </Router>
    </Provider>,
    document.getElementById('app')
);