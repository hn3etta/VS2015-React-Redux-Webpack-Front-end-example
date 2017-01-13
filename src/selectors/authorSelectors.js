import Immutable, {Map} from 'immutable';

export function formatAuthorsForDisplay(immtblAuthors, fieldMap = {id: 'id', fullName: 'fullName'}) {
	if (!immtblAuthors || !Immutable.Iterable.isIterable(immtblAuthors)) {
		return;
	}

	return immtblAuthors.map(author => {
		return Map().withMutations(o => {
			o.set(fieldMap.id, author.get('id'));
			o.set(fieldMap.fullName, author.get('firstName') + ' ' + author.get('lastName'));
		});
	});
}
