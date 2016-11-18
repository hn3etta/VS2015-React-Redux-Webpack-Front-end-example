import CourseForm from './CourseForm';

/* Use "require" for non ES6 Modules */
let React = require('react');
let expect = require('expect');
let TestUtils = require('react-addons-test-utils');
let mount = require('enzyme').mount;
let shallow = require('enzyme').shallow;

function setup(loading, addMode) {
    let props = {
        course: {},
        allAuthors: {},
        onAction: () => { },
        onChange: () => { },
        loading: loading,
        errors: {},
        onCancel: () => { },
        addMode: addMode
    };

    return shallow(<CourseForm {...props} />);
}

describe("CourseForm Tests", () => {
    it("Form exists", () => {
        const wrapper = setup(false, false);

        // Positive tests
        expect(wrapper.find(".manage-course-form").length).toBe(1);

        // Negative tests

    });

    it("Adding course element labels", () => {
        const wrapper = setup(false, true);

        // Positive tests
        expect(wrapper.find(".manage-course-form__title").text()).toEqual("Add Course");
        expect(wrapper.find(".manage-course-form__action-btn").text()).toEqual("Add");

        // Negative tests
        expect(wrapper.find(".busyAnimation").length).toBe(0);
        expect(wrapper.find(".manage-course-form__action-btn--busy").length).toBe(0);
    });

    it("Adding course busy", () => {
        const wrapper = setup(true, true);

        // Positive tests
        expect(wrapper.find(".manage-course-form__title").text()).toEqual("Add Course");
        expect(wrapper.find(".manage-course-form__action-btn").text()).toEqual("Adding");
        expect(wrapper.find(".busyAnimation").length).toBe(1);
        expect(wrapper.find(".manage-course-form__action-btn--busy").length).toBe(1);

        // Negative tests
        
    });

    it("Managing course element labels", () => {
        const wrapper = setup(false, false);

        // Positive tests
        expect(wrapper.find(".manage-course-form__title").text()).toEqual("Manage Course");
        expect(wrapper.find(".manage-course-form__action-btn").text()).toEqual("Save");

        // Negative tests
        expect(wrapper.find(".busyAnimation").length).toBe(0);
        expect(wrapper.find(".manage-course-form__action-btn--busy").length).toBe(0);
    });

    it("Managing course busy", () => {
        const wrapper = setup(true, false);

        // Positive tests
        expect(wrapper.find(".manage-course-form__title").text()).toEqual("Manage Course");
        expect(wrapper.find(".manage-course-form__action-btn").text()).toEqual("Saving");
        expect(wrapper.find(".busyAnimation").length).toBe(1);
        expect(wrapper.find(".manage-course-form__action-btn--busy").length).toBe(1);

        // Negative tests
    });


});