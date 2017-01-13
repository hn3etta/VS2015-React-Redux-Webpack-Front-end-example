import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import CourseListRow from './CourseListRow';
import '../../styles/objects/object.courselist.scss';
import '../../styles/components/component.courselist.scss';

const CourseList = ({courses, onEdit, onDelete, onEditOpenCourse, allAuthors}) => {
	return (
		<section className="courses">
			<div className="courses__headings">
				<div className="title-1"/>
				<div className="title-2">
					Title
				</div>
				<div className="title-3">
					Author
				</div>
				<div className="title-4">
					Category
				</div>
				<div className="title-5">
					Length
				</div>
				<div className="title-6">
					Status
				</div>
				<div className="title-7"/>
				<div className="title-8"/>
			</div>
			{courses.map(immtblCourse =>
				<CourseListRow key={immtblCourse.get('id')} course={immtblCourse} allAuthors={allAuthors} editCallback={onEdit} deleteCallback={onDelete} editOpenCourseCallback={onEditOpenCourse}/>
			)}
		</section>
	);
};

CourseList.propTypes = {
	courses: ImmutablePropTypes.list,
	allAuthors: ImmutablePropTypes.list,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onEditOpenCourse: PropTypes.func.isRequired
};

export default CourseList;
