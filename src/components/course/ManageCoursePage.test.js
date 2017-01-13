import React from 'react';
import {mount} from 'enzyme';
import Immutable, {Map} from 'immutable';

import {ManageCoursePage} from './ManageCoursePage';

describe('Manage Course Page Tests', () => {
	const props = {
		actions: {},
		authors: Immutable.fromJS(
			[
				{
					id: 0,
					firstName: 'Bill',
					lastName: 'Anderson',
					value: 0
				},
				{
					id: 1,
					firstName: 'John',
					lastName: 'Appleseed',
					value: 1
				}
			]
		),
		courseFormActions: {},
		coursesCntr: Map({}),
		modalData: Map({}),
		loading: false
	};
	const wrapper = mount(<ManageCoursePage {...props}/>);
	const saveButton = wrapper.find('.manage-course-form__action-btn');
	saveButton.simulate('click');

	describe('Form Validation', () => {
		it('Title', () => {
			// Positive tests
			expect(wrapper.state().errors.title).toBe('Please enter a title with at least three characters');
		});

		it('Author', () => {
			// Positive tests
			expect(wrapper.state().errors.authorId).toBe('Please select an author');
		});

		it('Length', () => {
			// Positive tests
			expect(wrapper.state().errors.length).toBe('Please enter a length value');
		});

		it('Category', () => {
			// Positive tests
			expect(wrapper.state().errors.category).toBe('Please enter a category name');
		});

		it('Watch URL', () => {
			// Positive tests
			expect(wrapper.state().errors.watchHref).toBe('Please enter a watch URL');
		});
	});

	describe('Form Updates', () => {
		it('Set Title', () => {
			// Set the value
			const titleElm = wrapper.find('.manage-course-form__title-input');
			titleElm.node.value = 'Testing Title';
			titleElm.simulate('change');

			// Positive tests
			expect(wrapper.state().course.title).toBe('Testing Title');
		});

		// it("Set Author", () => {
		//    // Set the value
		//    const authorElm = wrapper.find(".manage-course-form__author-select");
		//    authorElm.node.value = 0;
		//    authorElm.simulate("keyDown", { keyCode: 40 });

		//    // Positive tests
		//    expect(wrapper.state().course.author).toBe("0");
		// });

		it('Set Category', () => {
			// Set the value
			const catElm = wrapper.find('.manage-course-form__category-input');
			catElm.node.value = 'Testing Category';
			catElm.simulate('change');

			// Positive tests
			expect(wrapper.state().course.category).toBe('Testing Category');
		});

		it('Set Length', () => {
			// Set the value
			const lengthElm = wrapper.find('.manage-course-form__length-input');
			lengthElm.node.value = 'Testing Length';
			lengthElm.simulate('change');

			// Positive tests
			expect(wrapper.state().course.length).toBe('Testing Length');
		});

		it('Set Watch HREF', () => {
			// Set the value
			const watchElm = wrapper.find('.manage-course-form__watchHref-input');
			watchElm.node.value = 'Testing Watch HREF';
			watchElm.simulate('change');

			// Positive tests
			expect(wrapper.state().course.watchHref).toBe('Testing Watch HREF');
		});

		// //manage-course-form__cancel-btn
		// it("Cancel button clicked", () => {
		//    // Set the value
		//    const cancelBtnElm = wrapper.find(".manage-course-form__cancel-btn");
		//    cancelBtnElm.simulate("click");

		//    // Positive tests
		//    expect(wrapper.state().course.watchHref).toBe("Testing Watch HREF");
		// });
	});

	describe('Form Validation', () => {
		it('Title', () => {
			// Positive tests
			expect(wrapper.state().errors.title).toBe('Please enter a title with at least three characters');
		});
	});
});
