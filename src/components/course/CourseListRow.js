import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import ImageClick from '../common/ImageClick';
import LinkClick from '../common/LinkClick';
import EditIcon from '../../images/edit-icon.png';
import DeleteIcon from '../../images/trash-can.png';

const CourseListRow = ({course, editCallback, deleteCallback, editOpenCourseCallback, allAuthors}) => {
	// convert authorId to author full name
	function authorDisplay(authors, authorId) {
		const author = allAuthors.filter(
			author => author.get('id') === authorId
		);

		if (author.size === 1) {
			return author.get(0).get('fullName');
		}

		return '';
	}

	return (
		<div className="courses__rows">
			<div className="col-1">
				<a href={course.get('watchHref')} target="_blank" rel="noopener noreferrer">Watch</a>
			</div>
			<div className="col-2">
				{course.get('title')}
				{/*
					<Link to={'/course/' + course.get("id")}>{course.get("title")}</Link>
				*/}
			</div>
			<div className="col-3">
				{authorDisplay(allAuthors, course.get('authorId'))}
			</div>
			<div className="col-4">
				{course.get('category')}
			</div>
			<div className="col-5">
				{course.get('length')}
			</div>
			<div className="col-6">
				<LinkClick
					id={course.get('id')}
					cssClassName={course.get('isOpen') ? 'course__edit-open-status' : 'course__edit-closed-status'}
					clickAction={editOpenCourseCallback}
					text={course.get('isOpen') ? 'Open' : 'Closed'}
					title="Change Open Course Status"
				/>
			</div>
			<div className="col-7">
				<ImageClick
					id={course.get('id')}
					src={EditIcon}
					cssClassName="course__edit"
					clickAction={editCallback}
					title="Edit Course"
				/>
			</div>
			<div className="col-8">
				<ImageClick
					id={course.get('id')}
					src={DeleteIcon}
					cssClassName="course__delete"
					clickAction={deleteCallback}
					title="Delete Course"
				/>
			</div>
		</div>
	);
};

CourseListRow.propTypes = {
	course: PropTypes.object.isRequired,
	editCallback: PropTypes.func.isRequired,
	deleteCallback: PropTypes.func.isRequired,
	editOpenCourseCallback: PropTypes.func.isRequired,
	allAuthors: ImmutablePropTypes.list
};

export default CourseListRow;
