/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;

class ImageClick extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.imageWasClicked = this.imageWasClicked.bind(this);
    }

    imageWasClicked(isOpen) {
        if (this.props.passNumber) {
            this.props.clickAction(this.props.id, this.props.passNumber);
            return;
        }

        this.props.clickAction(this.props.id);
    }

    render() {
        return (
            <img
                className={this.props.cssClassName}
                src={this.props.src}
                onClick={this.imageWasClicked}
                title={this.props.title} />
        );
    }
}

ImageClick.propTypes = {
    id: PropTypes.number.isRequired,
    passNumber: PropTypes.number,
    src: PropTypes.string.isRequired,
    cssClassName: PropTypes.string,
    clickAction: PropTypes.func.isRequired,
    title: PropTypes.string
};


export default ImageClick;