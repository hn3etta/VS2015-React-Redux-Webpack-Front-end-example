import Immutable from 'immutable';
import {formatAuthorsForDisplay} from './authorSelectors';

describe('Author Selector Tests', () => {
	describe('formatAuthorsForDisplay', () => {
		it('should return author data formatted for use in a dropdown', () => {
			const immtblAuthors = Immutable.fromJS([
				{
					id: 0,
					firstName: 'Cory',
					lastName: 'House'
				},
				{
					id: 1,
					firstName: 'Scott',
					lastName: 'Allen'
				}
			]);

			const fieldMap = {
				id: 'value',
				fullName: 'text'
			};

			const expectedBase = Immutable.fromJS([
				{
					id: 0,
					fullName: 'Cory House'
				},
				{
					id: 1,
					fullName: 'Scott Allen'
				}
			]);

			const expectedCustom = Immutable.fromJS([
				{
					value: 0,
					text: 'Cory House'
				},
				{
					value: 1,
					text: 'Scott Allen'
				}
			]);

			// Positive tests
			expect(formatAuthorsForDisplay(immtblAuthors).equals(expectedBase)).toBe(true);
			expect(formatAuthorsForDisplay(immtblAuthors, fieldMap).equals(expectedCustom)).toBe(true);
		});
	});
});
