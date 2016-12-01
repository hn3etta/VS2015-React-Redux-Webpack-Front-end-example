/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;

class LinkClick extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.linkWasClicked = this.linkWasClicked.bind(this);
    }

    linkWasClicked(event) {
        event.preventDefault();

        if (this.props.passNumber) {
            this.props.clickAction(this.props.id, this.props.passNumber);
            return;
        }

        this.props.clickAction(this.props.id);
    }

    render() {
        return (
            <a href="#"
                className={this.props.cssClassName}
                onClick={this.linkWasClicked}
                title={this.props.title}>
                {this.props.text}
            </a >
        );
    }
}

LinkClick.propTypes = {
    id: PropTypes.number.isRequired,
    passNumber: PropTypes.number,
    cssClassName: PropTypes.string,
    clickAction: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string
};


export default LinkClick;