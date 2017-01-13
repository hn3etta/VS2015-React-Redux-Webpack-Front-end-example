export function objectsMatch(obj1, obj2) {
	let areSame = true;

	for (const propertyName in obj1) {
		if (obj1[propertyName] !== obj2[propertyName] || obj1[propertyName] !== obj2[propertyName]) {
			areSame = false;
			break;
		}
	}

	return areSame;
}

export function isEmpty(obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}
