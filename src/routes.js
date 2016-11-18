import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import LoginPage from './components/authentication/LoginPage';
import LogoffPage from './components/authentication/LogoffPage';
import HomePage from './components/home/HomePage';
import ReactPage from './components/learn-about/ReactPage';
import ReduxPage from './components/learn-about/ReduxPage';
import ReactRouterPage from './components/learn-about/ReactRouterPage';
import WebpackPage from './components/learn-about/WebpackPage';
import OpenCoursesPage from './components/open-course/OpenCoursesPage';
import CoursesPage from './components/course/CoursesPage';

/* Use "require" for non ES6 Modules */
let React = require('react');

export const GetRoutes = (store) => {
    // The following is not used since the user auth data is persisted to browser local storage
    // Takes time for the auth data to saturate and dispatch event.
    // Components will check if the user is authenticated or not
    /*
    const requireAuth = (nextState, replace) => {
        if (store.getState().authReducer.user.get("isAuthenticated") == false) {
            replace({ nextPathname: nextState.location.pathname }, '/login');
        }
    };
    */
    return (
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="login" component={LoginPage} />
            <Route path="logoff" component={LogoffPage} />

            <Route path="react" component={ReactPage} />
            <Route path="redux" component={ReduxPage} />
            <Route path="react-router" component={ReactRouterPage} />
            <Route path="webpack" component={WebpackPage} />

            <Route path="courses" component={CoursesPage} /*onEnter={requireAuth}*/ />
            <Route path="open-courses" component={OpenCoursesPage} /*onEnter={requireAuth}*/ />
        </Route>
    );
};