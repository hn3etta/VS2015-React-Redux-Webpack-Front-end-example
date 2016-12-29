/* Use "require" for non ES6 Modules */
let Map = require('immutable').Map;
let List = require('immutable').List;

export default {
    openCoursesCntr: Map({
        allOpenCourses: List([]),
        statusText: '',
        ajaxStart: undefined,
        ajaxEnd: undefined
    })
};