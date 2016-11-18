/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

export default {
    authorsCntr: Map({
        allAuthors: List([]),
        statusText: '',
        ajaxStart: undefined,
        ajaxEnd: undefined
    })
};