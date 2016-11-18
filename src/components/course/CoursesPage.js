import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';
import * as courseFormActions from '../../actions/courseFormActions';
import * as redirectActions from '../../actions/redirectActions';
import {withRouter} from 'react-router';

/* Use "require" for non ES6 Modules */
let React = require('react');
let ReactDOM = require('react-dom');
let PropTypes = React.PropTypes;
let connect = require('react-redux').connect;
let ReactCSSTransitionGroup = require('react-addons-css-transition-group');
let ImmutablePropTypes = require('react-immutable-proptypes');

//Project Components
import CourseList from './CourseList';
import SideModal from '../common/SideModal';
import ManageCoursePage from './ManageCoursePage'; //eslint-disable-line import/no-named-as-default
// Selectors
import {formatAuthorsForDisplay} from '../../selectors/authorSelectors';
// Utilities/Settings
import {objectsMatch} from '../../utilities/objectUtilities';
// SCSS
import '../../styles/objects/pages/object.course-page.scss';
import '../../styles/components/pages/component.course-page.scss';


class CoursesPage extends React.Component {
    constructor(props, context){
        super(props, context);

        /* Set context for DOM Event functions */
        this.addCourseClick = this.addCourseClick.bind(this);
        this.toggleModalState = this.toggleModalState.bind(this);
        this.editCourse = this.editCourse.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    /* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
    shouldComponentUpdate(nextProps, nextState) {
        // Check if the new props/state are different the current props/state
        if (!nextProps.immtblCoursesCntr.equals(this.props.immtblCoursesCntr)) {
            return true;
        }

        if (!nextProps.authors.equals(this.props.authors)) {
            return true;
        }

        if (!nextProps.modalData.equals(this.props.modalData)) {
            return true;
        }
        
        if (!nextProps.immtblUsr.equals(this.props.immtblUsr)) {
            return true;
        }

        if (!objectsMatch(nextState, this.state)) {
            return true;
        }

        return false;
    }

    componentWillUpdate() {
        // Check if user is authenticated
        if (this.props.immtblUsr.get("isAuthenticated") == false) {
            const {location} = this.props;
            // Save this page route for post-auth redirect
            this.props.redirectActions.postAuthRedirect(location.pathname);
            // Push user to the login.  Not using browserHistory so when users' 
            // click back they don't navigate to the login page.
            this.props.router.push('/login');
        }
    }

    addCourseClick(event) {
        event.preventDefault();
        this.toggleModalState();
    }

    editCourse(courseId) {
        this.props.courseFormActions.openScreen(this.props.modalData.withMutations(m => {
            m.set("courseFormModalOpen", true)
             .set("courseId", courseId);
        }));
    }

    deleteCourse(courseId) {
        this.props.courseActions.deleteCourse(courseId);
    }

    toggleModalState() {
        if (this.props.modalData.get("courseFormModalOpen")) {
            this.props.courseFormActions.closeScreen(this.props.modalData.withMutations(mObj => {
                mObj.set("courseFormModalOpen", false)
                    .set("courseId", "");
            }));
        } else {
            this.props.courseFormActions.closeScreen(this.props.modalData.withMutations(mObj => {
                mObj.set("courseFormModalOpen", true)
                    .set("courseId", "");
            }));
        }
    }

    render() {
        const {immtblCoursesCntr, authors, modalData} = this.props; /* Destructure objects for easier rendering code (readability) */
        return (
            <div className="course-page">
                <div className="course-page__sidebar">
                    <a href="/course"
                        className="course-page__add-btn"
                        onClick={this.addCourseClick}>
                        Add a Course
                    </a>
                </div>
                <SideModal
                    isOpen={modalData.get("courseFormModalOpen")}>
                    <ManageCoursePage />
                </SideModal>
                <div className="course-page__main-cntr">
                    <div className="course-page__main">
                        <h1 className="course-page__title">Courses</h1>
                        <CourseList
                            courses={immtblCoursesCntr.get("allCourses")}
                            allAuthors={authors}
                            onEdit={this.editCourse}
                            onDelete={this.deleteCourse} />
                    </div>
                </div>
            </div>
        );
    }

}

/* Component Validation */
CoursesPage.propTypes = {
    immtblCoursesCntr: ImmutablePropTypes.map,
    authors: ImmutablePropTypes.list,
    immtblUsr: ImmutablePropTypes.map,
    courseActions: PropTypes.object.isRequired,
    courseFormActions: PropTypes.object.isRequired,
    redirectActions: PropTypes.object.isRequired,
    modalData: ImmutablePropTypes.map,
    router: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
};

/* Redux connect and related functions */
function mapStateToProps(state, ownProps) {
    return {
        immtblCoursesCntr: state.coursesReducer.coursesCntr,
        authors: formatAuthorsForDisplay(state.authorsReducer.authorsCntr.get("allAuthors")),
        modalData: state.courseFormReducer.modalData,
        immtblUsr: state.authReducer.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        courseActions: bindActionCreators(courseActions, dispatch),  // bindActionCreators automatically wraps courseActions with dispathes
        courseFormActions: bindActionCreators(courseFormActions, dispatch),
        redirectActions: bindActionCreators(redirectActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CoursesPage));  // Connect is a higher order component
