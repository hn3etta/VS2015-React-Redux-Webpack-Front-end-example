import React, {Component, PropTypes} from 'react';

class LinkClick extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		event.preventDefault();

		if (this.props.passNumber) {
			this.props.clickAction(this.props.id, this.props.passNumber);
			return;
		}

		this.props.clickAction(this.props.id);
	}

	render() {
		return (
			<a
				href="#"
				className={this.props.cssClassName}
				onClick={this.handleClick}
				title={this.props.title}
			>
				{this.props.text}
			</a>
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
