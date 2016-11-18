/* Use "require" for non ES6 Modules */
let React = require('react');

// Images
import ReduxFlowchart from '../../images/webpack-flowchart.png';
// SCSS
import '../../styles/objects/pages/object.webpack-page.scss';
import '../../styles/components/pages/component.webpack-page.scss';

class WebpackPage extends React.Component {
    render() {
        return (
            <div className="webpack-page">
                <h1 className="webpack-page__title">
                    Webpack
                </h1>
                <img className="webpack-page__content-image" src={ReduxFlowchart} />
            </div>
        );
    }
}

export default WebpackPage;