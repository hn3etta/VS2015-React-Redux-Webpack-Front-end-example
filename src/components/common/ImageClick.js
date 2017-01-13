import React, {Component, PropTypes} from 'react';

class ImageClick extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
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
				onClick={this.handleClick}
				title={this.props.title}
			/>
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
