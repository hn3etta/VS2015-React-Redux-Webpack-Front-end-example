/* Stateless functional component */
import { Link } from 'react-router';
import TextInput from '../common/TextInput';
import SelectInput from '../common/SelectInput';
import BooleanLinks from '../common/BooleanLinks';

/* Use "require" for non ES6 Modules */
let React = require('react');
let Immutable = require('immutable');
let List = require('immutable').List;
let ImmutablePropTypes = require('react-immutable-proptypes');

// Utilities
import {objectsMatch} from '../../utilities/objectUtilities';

/* Destructured props passed in.  Keeps component leaner */
const CourseForm = ({ course, allAuthors, onAction, onChange, loading, errors, onCancel, addMode }) => {

    function getCSSClasses(loadStatus) {
        let baseCSS = "manage-course-form__action-btn";

        if (loadStatus) {
            return baseCSS + " manage-course-form__action-btn--busy";
        } else {
            return baseCSS;
        }
    }

    // Handle button text for adding or saving courses
    function getMessage(addMode, loadStatus) {
        let msg = "Save";

        if (addMode)
            msg = "Add";

        if (loadStatus && !addMode)
            return "Saving";

        if (loadStatus && addMode)
            return "Adding";

        return msg;
    }
    
    return (
        <form className="manage-course-form">
            <h1 className="manage-course-form__title">
                {addMode ? "Add Course" : "Manage Course"}
            </h1>
            <TextInput
                type="text"
                name="title"
                label="Title"
                value={course.title}
                onChange={onChange}
                error={errors.title}
                containerCssClass="manage-course-form__input-cntr"
                labelCssClass="manage-course-form__title-label"
                inputCssClass="manage-course-form__title-input"
                errorCssClass="manage-course-form__title-error"/>

            <SelectInput
                name="authorId"
                label="Author"
                value={course.authorId ? course.authorId.toString() : ""}
                defaultOption="Select Author"
                options={Immutable.Iterable.isIterable(allAuthors) ? allAuthors : []}
                onChange={onChange}
                error={errors.authorId}
                containerCssClass="manage-course-form__input-cntr"
                labelCssClass="manage-course-form__author-label"
                selectCssClass="manage-course-form__author-select"
                errorCssClass="manage-course-form__author-error"/>

            <TextInput
                type="text"
                name="category"
                label="Category"
                value={course.category}
                onChange={onChange}
                error={errors.category}
                containerCssClass="manage-course-form__input-cntr"
                labelCssClass="manage-course-form__category-label"
                inputCssClass="manage-course-form__category-input"
                errorCssClass="manage-course-form__category-error"/>

            <TextInput
                type="text"
                name="length"
                label="Length"
                value={course.length}
                onChange={onChange}
                error={errors.length}
                containerCssClass="manage-course-form__input-cntr"
                labelCssClass="manage-course-form__length-label"
                inputCssClass="manage-course-form__length-input"
                errorCssClass="manage-course-form__length-error"/>

            <TextInput
                type="text"
                name="watchHref"
                label="Watch HREF"
                value={course.watchHref}
                onChange={onChange}
                error={errors.watchHref}
                containerCssClass="manage-course-form__input-cntr"
                labelCssClass="manage-course-form__watchHref-label"
                inputCssClass="manage-course-form__watchHref-input"
                errorCssClass="manage-course-form__watchHref-error"/>

            <div className="manage-course-form__button-cntr">
                <a href="#"
                    className={getCSSClasses(loading)}
                    onClick={onAction}>
                    {getMessage(addMode, loading)}
                    {loading && <div className="busyAnimation" />}
                </a>

                <a href="#"
                    className="manage-course-form__cancel-btn"
                    onClick={onCancel}>
                    Cancel
                </a>
            </div>
        </form>
    );
};

CourseForm.propTypes = {
    course: React.PropTypes.object.isRequired,
    allAuthors: ImmutablePropTypes.list,
    onAction: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    loading: React.PropTypes.bool,
    addMode: React.PropTypes.bool,
    errors: React.PropTypes.object
};

export default CourseForm;