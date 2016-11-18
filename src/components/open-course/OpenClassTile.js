import {Doughnut} from 'react-chartjs-2'; //eslint-disable-line import/named
// Presentational Components
import ImageClick from '../common/ImageClick';


/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;
let PieChart = require('react-d3-components').PieChart;
let ImmutablePropTypes = require('react-immutable-proptypes');


const OpenClassTile = ({attendeeIcon, emptyDeskIcon, maxAttendeeIcon, addIcon, subtractIcon, courseName, immtblOpenCourse, immtblOpenCourseCntr, openCourseRefreshSecondsChange, refreshSecsInterval}) => {
    return (
        <div className="oc-container">
            <div className="oc-item-top-text">
                <p className="oc-item-top-text__title">
                    {courseName}
                </p>
            </div>
            <div className="oc-item-main">
                <div className={immtblOpenCourseCntr.get("updating") 
                                    ? "oc-item-main__status animQtrSec oc-item-main__status--active" 
                                    : "oc-item-main__status animQtrSec"}>
                    <div className="oc-item-main__status__message">
                        <p className="updating-message">
                            Updating...
                        </p>
                    </div>
                    <div className="oc-item-main__status__background"></div>
                </div>
                <div className="oc-item-main__container">
                    <div className="oc-item-main__left">
                        <div className="oc-item-display">
                            <div className="oc-item-display__icon">
                                <img className="oc-item-display__icon__img" src={attendeeIcon} />
                            </div>
                            <div className="oc-item-display__value">
                                <p className="oc-item-display__value__title">
                                    Attendees
                                </p>
                                <div className="oc-item-display__value__container">
                                    <div className="oc-data-value">
                                        {immtblOpenCourse.get("attendees")}
                                    </div>
                                    <div className="oc-data-edit">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="oc-item-display">
                            <div className="oc-item-display__icon">
                                <img className="oc-item-display__icon__img" src={emptyDeskIcon} />
                            </div>
                            <div className="oc-item-display__value">
                                <p className="oc-item-display__value__title">
                                    Openings
                                </p>
                                <div className="oc-item-display__value__container">
                                    <div className="oc-data-value">
                                        {immtblOpenCourse.get("maxAttendees") - immtblOpenCourse.get("attendees")}
                                    </div>
                                    <div className="oc-data-edit">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="oc-item-display">
                            <div className="oc-item-display__icon">
                                <img className="oc-item-display__icon__img" src={maxAttendeeIcon} />
                            </div>
                            <div className="oc-item-display__value">
                                <p className="oc-item-display__value__title">
                                    Maximum
                                </p>
                                <div className="oc-item-display__value__container">
                                    <div className="oc-data-value">
                                        {immtblOpenCourse.get("maxAttendees")}
                                    </div>
                                    <div className="oc-data-edit">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="oc-item-main__right">
                        <div className="oc-item-visuals">
                            <div className="oc-item-visuals__graphic">
                                <Doughnut
                                    data={{
                                        labels: [
                                            'Attendees',
                                            'Openings'
                                        ],
                                        datasets: [{
                                            data: [
                                                immtblOpenCourse.get("attendees"),
                                                immtblOpenCourse.get("maxAttendees") - immtblOpenCourse.get("attendees")
                                            ],
                                            backgroundColor: [
                                                '#036ab7',
                                                '#cccccc'
                                            ],
                                            hoverBackgroundColor: [
                                                '#035A9C',
                                                '#b0b0b0'
                                            ]
                                        }]
                                    }}
                                    options={{ animation: { animateRotate: immtblOpenCourseCntr.get("animateChart")} }}
                                    width={125}
                                    height={125}
                                    />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="oc-item-bottom">
                <div className="oc-item-bottom__status">
                    <p className="oc-item-bottom__status__label">
                        Updated:
                    </p>
                    <p className="oc-item-bottom__status__value">
                        {immtblOpenCourseCntr.get("updatedMsg")}
                    </p>
                </div>
                <div className="oc-item-bottom__upd-intrvl">
                    <div className="oc-item-bottom__upd-intrvl__text">
                        update interval (secs)
                    </div>
                    <div className="oc-item-bottom__upd-intrvl__inputs">
                        <ImageClick
                            id={immtblOpenCourse.get("id")}
                            passNumber={refreshSecsInterval}
                            src={addIcon}
                            cssClassName="refresh-seconds-add-icon"
                            clickAction={openCourseRefreshSecondsChange}
                            title="Add seconds" />
                        <span className="refresh-seconds-display">
                            {immtblOpenCourseCntr.get("refreshSeconds")}
                        </span>
                        <ImageClick
                            id={immtblOpenCourse.get("id")}
                            passNumber={-refreshSecsInterval}
                            src={subtractIcon}
                            cssClassName="refresh-seconds-subtract-icon"
                            clickAction={openCourseRefreshSecondsChange}
                            title="Subtract Seconds" />
                    </div>
                </div>
            </div>
        </div>
    );
};

OpenClassTile.propTypes = {
    attendeeIcon: PropTypes.string,
    emptyDeskIcon: PropTypes.string,
    maxAttendeeIcon: PropTypes.string,
    addIcon: PropTypes.string,
    subtractIcon: PropTypes.string,
    courseName: PropTypes.string,
    immtblOpenCourse: ImmutablePropTypes.map,
    immtblOpenCourseCntr: ImmutablePropTypes.map,
    openCourseRefreshSecondsChange: PropTypes.func.isRequired,
    refreshSecsInterval: PropTypes.number.isRequired
};

export default OpenClassTile;