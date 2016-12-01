import {bindActionCreators} from 'redux';

/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;
let connect = require('react-redux').connect;
let ImmutablePropTypes = require('react-immutable-proptypes');

// Action creators
import * as courseActions from '../../actions/courseActions';
import * as authorActions from '../../actions/authorActions';
import * as ajaxActions from '../../actions/ajaxStatusActions';
import * as courseFormActions from '../../actions/courseFormActions';
// Models
import courseModel from '../../initModels/initialCourseState';
import courseErrors from '../../error-messages/courseFormErrors';
import initCourse from '../../initModels/initialCourseFormState';
// Selectors
import {formatAuthorsForDisplay} from '../../selectors/authorSelectors';
// Utilities
import {objectsMatch} from '../../utilities/objectUtilities';
// Presentational Components
import CourseForm from './CourseForm';
// SCSS
import '../../styles/objects/pages/object.manage-course-page.scss';
import '../../styles/components/pages/component.manage-course-page.scss';

export class ManageCoursePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            course: Object.assign({}, initCourse),
            addMode: true,
            errors: {}
        };

        /* Set context for DOM Event functions */
        this.updateCourseState = this.updateCourseState.bind(this);
        this.courseAction = this.courseAction.bind(this);
        this.cancelCourseScreen = this.cancelCourseScreen.bind(this);
        this.closeFormScren = this.closeFormScren.bind(this);
    }

    /* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
    shouldComponentUpdate(nextProps, nextState) {
        // Check if the new props/state are different the current props/state
        if (!nextProps.coursesCntr.equals(this.props.coursesCntr)) {
            return true;
        }

        if (!nextProps.authors.equals(this.props.authors)) {
            return true;
        }

        if (nextProps.loading != this.props.loading) {
            return true;
        }

        if (!nextProps.modalData.equals(this.props.modalData)) {
            return true;
        }

        if (!objectsMatch(nextState, this.state)) {
            return true;
        }

        return false;
    }

    componentWillUpdate(nextProps, nextState) {
        // Update the state only when the coursesCntr's course objects have changed
        if (!nextProps.coursesCntr.equals(this.props.coursesCntr) &&
            !nextProps.coursesCntr.get("allCourses").equals(this.props.coursesCntr.get("allCourses"))) {

            let courseMatchArr = nextProps.coursesCntr.get("allCourses").filter(
                o => o.get("id") == nextProps.modalData.get("courseId")
            );

            if (courseMatchArr.size == 1) {
                // Save Immutable course object to plain JS object for state manipulation (performance increase?)
                this.setState({
                    course: courseMatchArr.get(0).toObject()
                });
            }
        }

        if (!nextProps.modalData.equals(this.props.modalData)) {

            if (nextProps.modalData.get("courseId").length == 0) {
                this.setState({
                    course: initCourse,
                    addMode: true
                });
                return;
            }

            // Filter will return a Immutable List of an object 
            let foundCourse = nextProps.coursesCntr.get("allCourses").filter(
                o => o.get("id") == nextProps.modalData.get("courseId")
            );

            if (foundCourse.size == 1) {
                // Save Immutable course object to plain JS object for state manipulation (performance increase?)
                this.setState({
                    course: foundCourse.get(0).toObject(),
                    addMode: false
                });
            }
        }

    }

    // update the state which holds the latest input values
    updateCourseState(event) {
        const field = event.target.name;
        let course = Object.assign({}, this.state.course);
        course[field] = event.target.value;
        return this.setState({ course: course });
    }

    courseAction(event) {
        event.preventDefault();

        // If another UI api call in progress then skip
        if (this.isValidForm() && !this.props.loading) {

            // Add Course
            if (this.state.addMode) {
                // After the API call finishes, the API promise will execute the next "then" instruction
                this.props.actions.addCourse(this.state.course)
                    .then(() => {
                        this.closeFormScren();
                    });

            } else {
                // Save Course
                this.props.actions.saveCourse(this.state.course)
                    .then(() => {
                        this.closeFormScren();
                    });

            }            
        }
    }

    closeFormScren() {
        this.props.courseFormActions.closeCourseFormScreen();
    }

    isValidForm() {
        let isValid = true;
        let errors = {};
        // enumerate over course error properties to make sure all are accounted for
        for (let errorProp in courseErrors) {
            // If an error exists for this property and the course prop is empty
            if (typeof this.state.course[errorProp] === "undefined" || this.state.course[errorProp] == courseErrors[errorProp].emptyVal) {
                errors[errorProp] = courseErrors[errorProp].errorMessage;
                isValid = false;
            }
        }
        this.setState({ errors });
        return isValid;
    }

    // raise cancel add/edit action
    cancelCourseScreen(event) {
        event.preventDefault();

        this.closeFormScren();

        this.setState({ errors: {} });
    }


    render() {
        const {authors} = this.props; /* Destructure objects for easier rendering code (readability) */
        return (
            <CourseForm
                allAuthors={authors}
                onChange={this.updateCourseState}
                onAction={this.courseAction}
                onCancel={this.cancelCourseScreen}
                course={this.state.course}
                loading={this.props.loading}
                addMode={this.state.addMode}
                errors={this.state.errors} />
        );
    }
}

ManageCoursePage.propTypes = {
    coursesCntr: ImmutablePropTypes.map,
    authors: ImmutablePropTypes.list,
    loading: PropTypes.bool.isRequired,
    modalData: ImmutablePropTypes.map,
    actions: PropTypes.object.isRequired,
    ajaxCalls: PropTypes.object.isRequired,
    courseFormActions: PropTypes.object.isRequired
};

// Pull in the React Router context so router is available on this.context.router.
ManageCoursePage.contextTypes = {
    router: PropTypes.object
};

/* Redux connect and related functions */
function mapStateToProps(state) {
    return {
        coursesCntr: state.coursesReducer.coursesCntr,
        authors: formatAuthorsForDisplay(state.authorsReducer.authorsCntr.get("allAuthors"), { id: "value", fullName: "text" }),
        loading: state.ajaxCallsReducer.ajaxCallsInProgress > 0,
        modalData: state.courseFormReducer.modalData
    };
}

// Map courseActions to dispatch events
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(courseActions, dispatch),
        ajaxCalls: bindActionCreators(ajaxActions, dispatch),
        courseFormActions: bindActionCreators(courseFormActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);