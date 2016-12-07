import {bindActionCreators} from 'redux';

/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;
let ImmutablePropTypes = require('react-immutable-proptypes');
let connect = require('react-redux').connect;

/* Stateless functional component */
import TextInput from '../common/TextInput';
import BooleanLinks from '../common/BooleanLinks';

// Action creators
import * as openCourseActions from '../../actions/openCourseActions';
import * as openCourseFormActions from '../../actions/openCourseFormActions';
// Models
import initOpenCourse from '../../initModels/initialOpenCourseState';
// Utilities
import {objectsMatch} from '../../utilities/objectUtilities';
// SCSS
import '../../styles/objects/pages/object.open-course-form.scss';
import '../../styles/components/pages/component.open-course-form.scss';


class OpenCourseForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
            openCourse: Object.assign({}, initOpenCourse),
            errors: {}
        };

        this.openCourseStatusChangeToOpen = this.openCourseStatusChangeToOpen.bind(this);
        this.openCourseStatusChangeToClosed = this.openCourseStatusChangeToClosed.bind(this);
        this.updateMaxAttendeesState = this.updateMaxAttendeesState.bind(this);
        this.openCourseStatusChangeSave = this.openCourseStatusChangeSave.bind(this);
        this.openCourseStatusChangeCancel = this.openCourseStatusChangeCancel.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // Course status click change detected
        if (typeof nextProps.openCourseModal.get("courseId") == "number") {
            // Determine if the last data pull for OpenCourses has the "clicked" course status id in it
            let openCourseMatch = nextProps.immtblOpenCoursesList.find(ocCntr => ocCntr.get("openCourse").get("courseId") == nextProps.openCourseModal.get("courseId"));

            if (openCourseMatch) {
                let openCourse = Object.assign({}, this.state.openCourse);
                openCourse.id = openCourseMatch.get("openCourse").get("id");
                openCourse.courseId = openCourseMatch.get("openCourse").get("courseId");
                openCourse.maxAttendees = openCourseMatch.get("openCourse").get("maxAttendees");
                this.setState({ openCourse, open: true });
            } else {
                this.setState({ openCourse: initOpenCourse, open: false });
            }
        } else {
            this.setState({ open: false });
        }
    }

    openCourseStatusChangeToOpen(event) {
        event.preventDefault();

        this.setState({ open: true });
    }

    openCourseStatusChangeToClosed(event) {
        event.preventDefault();

        this.setState({ open: false });
    }

    // update the state which holds the latest input values
    updateMaxAttendeesState(event) {
        let openCourse = Object.assign({}, this.state.openCourse);
        let errors = Object.assign({}, this.state.errors);
        const field = event.target.name;
        const valNumber = parseInt(event.target.value);

        if (typeof valNumber == "number" && valNumber > 0) {
            openCourse[field] = valNumber.toString();
            errors[field] = undefined;
        } else {
            openCourse[field] = "1";
            errors[field] = "Value needs to be a number and at least a value of 1";
        }

        return this.setState({ openCourse, errors });
    }

    openCourseStatusChangeSave(event) {
        event.preventDefault();

        if (this.state.open) {
            this.props.openCourseActions.saveOpenCourse(Object.assign({}, this.state.openCourse, { courseId: this.props.openCourseModal.get("courseId") }));
        } else {
            // Find the current openCourseCntr (that has the openCourse id) that matches the current openCourse modal courseId
            let openCourseCntr = this.props.immtblOpenCoursesList.find(openCourseCntr => openCourseCntr.get("openCourse").get("courseId") == this.props.openCourseModal.get("courseId"));
            this.props.openCourseActions.deleteOpenCourse(openCourseCntr.get("openCourse").get("id"), openCourseCntr.get("openCourse").get("courseId"));
        }
    }

    openCourseStatusChangeCancel(event) {
        event.preventDefault();

        this.props.openCourseFormActions.closeCourseIsOpenFormScreen();
    }


    render() {
        return (
            <form className="open-course-form">
                <h1 className="open-course-form__title">
                    Open Course Settings
                </h1>

                <BooleanLinks
                    containerCssClass="open-course-form__input-cntr"
                    labelCssClass="open-course-form__status-label"
                    labelText="Status"
                    trueCssClass="open-course-form__status-open"
                    trueText="Open"
                    trueClick={this.openCourseStatusChangeToOpen}
                    falseCssClass="open-course-form__status-closed"
                    falseText="Closed"
                    falseClick={this.openCourseStatusChangeToClosed}
                    trueSelected={this.state.open}
                    selectedCssModifier="--isTrue"
                    />

                <TextInput
                    type="text"
                    name="maxAttendees"
                    label="Max Attendees"
                    value={this.state.openCourse.maxAttendees.toString()}
                    onChange={this.updateMaxAttendeesState}
                    error={this.state.errors.maxAttendees}
                    disabled={!this.state.open}
                    containerCssClass="open-course-form__input-cntr"
                    labelCssClass="open-course-form__attendees-label"
                    inputCssClass="open-course-form__attendees-input"
                    errorCssClass="open-course-form__attendees-error"/>

                <div className="open-course-form__button-cntr">
                    <a href="#"
                        className="open-course-form__save-btn"
                        onClick={this.openCourseStatusChangeSave}>
                        {this.props.loading ? "Saving" : "Save"}
                        {this.props.loading && <div className="busyAnimation"></div>}
                    </a>

                    <a href="#"
                        className="open-course-form__cancel-btn"
                        onClick={this.openCourseStatusChangeCancel}>
                        Cancel
                    </a>
                </div>
            </form>
        );
    }
}

OpenCourseForm.propTypes = {
    openCourseModal: ImmutablePropTypes.map,
    immtblOpenCoursesList: ImmutablePropTypes.list,
    loading: PropTypes.bool,
    openCourseActions: PropTypes.object.isRequired,
    openCourseFormActions: PropTypes.object.isRequired
};

/* Redux connect and related functions */
function mapStateToProps(state, ownProps) {
    return {
        openCourseModal: state.openCourseFormReducer.modalData,
        immtblOpenCoursesList: state.openCoursesReducer.openCoursesCntr.get("allOpenCourses"),
        loading: state.ajaxCallsReducer.ajaxCallsInProgress > 0
    };
}

function mapDispatchToProps(dispatch) {
    return {
        openCourseActions: bindActionCreators(openCourseActions, dispatch),
        openCourseFormActions: bindActionCreators(openCourseFormActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(OpenCourseForm);  // Connect is a higher order component