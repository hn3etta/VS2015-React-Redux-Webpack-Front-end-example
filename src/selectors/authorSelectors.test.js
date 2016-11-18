// Get the selector
import {formatAuthorsForDisplay} from './authorSelectors';

/* Use "require" for non ES6 Modules */
let React = require('react');
let Immutable = require('immutable');
let Map = require('immutable').Map;
let List = require('immutable').List;
let expect = require('expect');

describe("Author Selector Tests", () => {

    describe("formatAuthorsForDisplay", () => {
        it("should return author data formatted for use in a dropdown", () => {
            const immtblAuthors = Immutable.fromJS([
                {
                    id: 0,
                    firstName: "Cory",
                    lastName: "House"
                },
                {
                    id: 1,
                    firstName: "Scott",
                    lastName: "Allen"
                }
            ]);

            const fieldMap = {
                id: "value",
                fullName: "text"
            };

            const expectedBase = Immutable.fromJS([
                {
                    id: 0,
                    fullName: "Cory House"
                },
                {
                    id: 1,
                    fullName: "Scott Allen"
                }
            ]);


            const expectedCustom = Immutable.fromJS([
                {
                    value: 0,
                    text: "Cory House"
                },
                {
                    value: 1,
                    text: "Scott Allen"
                }
            ]);

            // Positive tests
            expect(formatAuthorsForDisplay(immtblAuthors).equals(expectedBase)).toBe(true);
            expect(formatAuthorsForDisplay(immtblAuthors, fieldMap).equals(expectedCustom)).toBe(true);
        });

    });

});