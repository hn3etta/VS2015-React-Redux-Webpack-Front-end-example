export function getCourseName(courseId, courseList) {
	const foundCourse = courseList.find(course => course.get('id') === courseId);

	if (typeof foundCourse === 'object') {
		return foundCourse.get('title');
	}

	return '';
}

export function sortByCourseName(openCourseCntrA, openCourseCntrB) {
	return openCourseCntrA.get('courseName').localeCompare(openCourseCntrB.get('courseName'));
}
