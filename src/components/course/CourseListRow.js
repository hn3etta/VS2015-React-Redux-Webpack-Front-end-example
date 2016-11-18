﻿import {Link} from 'react-router';

/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;
let ImmutablePropTypes = require('react-immutable-proptypes');

// Presentational Components
import ImageClick from '../common/ImageClick';
// Images
import EditIcon from '../../images/edit-icon.png';
import DeleteIcon from '../../images/trash-can.png';

const CourseListRow = ({course, editCallback, deleteCallback, allAuthors}) => {
    // convert authorId to author full name
    function authorDisplay(authors, authorId) {
        let author = allAuthors.filter(
            author => author.get("id") == authorId
        );

        if (author.size == 1) {
            return author.get(0).get("fullName");
        } else {
            return "";
        }
    }

    return (
        <div className="courses__rows">
            <div className="col-1">
                <a href={course.get("watchHref")} target="_blank">Watch</a>
            </div>
            <div className="col-2">
                {course.get("title")}
                {/*
                    <Link to={'/course/' + course.get("id")}>{course.get("title")}</Link>
                */}
            </div>
            <div className="col-3">
                {authorDisplay(allAuthors,course.get("authorId"))}
            </div>
            <div className="col-4">
                {course.get("category")}
            </div>
            <div className="col-5">
                {course.get("length")}
            </div>
            <div className="col-6">
                <ImageClick
                    id={course.get("id")}
                    src={EditIcon}
                    cssClassName="course__edit"
                    clickAction={editCallback}
                    title="Edit Course" />
            </div>
            <div className="col-7">
                <ImageClick
                    id={course.get("id")}
                    src={DeleteIcon}
                    cssClassName="course__delete"
                    clickAction={deleteCallback}
                    title="Delete Course" />
            </div>
        </div>
    );
};

CourseListRow.propTypes = {
    course: PropTypes.object.isRequired,
    editCallback: PropTypes.func.isRequired,
    deleteCallback: PropTypes.func.isRequired,
    allAuthors: ImmutablePropTypes.list
};

export default CourseListRow;