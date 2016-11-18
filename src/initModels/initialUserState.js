/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;

export default {
    user: Map({
        username: '',
        isAuthenticated: undefined,
        token: undefined,
        authExpiresIn: 0,
        statusText: '',
        ajaxStart: undefined,
        ajaxEnd: undefined
    })
};