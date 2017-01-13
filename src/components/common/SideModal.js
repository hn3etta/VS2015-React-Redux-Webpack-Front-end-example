import React, {Component, PropTypes} from 'react';
import {TimelineLite, TweenLite} from 'gsap';

import '../../styles/objects/common/object.side-modal.scss';
import '../../styles/components/common/component.side-modal.scss';

class SideModal extends Component {
	constructor(props, context) {
		super(props, context);

		this.animMngrObj = {};
	}

	componentDidMount() {
		this.animMngrObj = this.loadGSTimeline(TimelineLite, TweenLite, this.props.location, this.sideModalCntr);
		this.determineModalDisplay(this.props.isOpen, this.animMngrObj);
	}

	/* React lifecycle function - exeuctes when props or state changes detected.  Here you can determine if the component needs to re-render or not */
	shouldComponentUpdate(nextProps) {
		if (nextProps.isOpen !== this.props.isOpen) {
			return true;
		}

		return false;
	}

	componentDidUpdate() {
		this.determineModalDisplay(this.props.isOpen, this.animMngrObj);
	}

	loadGSTimeline(TimelineLite, TweenLite, location, animElement) {
		const loc = location ? location : 'left';

		const animMngr = {tl: new TimelineLite()};

		switch (loc) {
			case 'left':
				animMngr.tl.add(TweenLite.from(animElement, 0.5, {x: -500, opacity: 0, zIndex: 0}));
				animMngr.tl.add(TweenLite.to(animElement, 0.5, {x: 0, opacity: 1, delay: 0.20}));
				animMngr.tl.add(TweenLite.to(animElement, 0.5, {zIndex: 1, delay: 0.30}));
				return animMngr;
			case 'right':
				animMngr.tl.add(TweenLite.from(animElement, 0.5, {x: 300, opacity: 0, zIndex: 0}));
				animMngr.tl.add(TweenLite.to(animElement, 0.5, {x: 0, opacity: 1, delay: 0.20}));
				animMngr.tl.add(TweenLite.to(animElement, 0.5, {zIndex: 1, delay: 0.30}));
				return animMngr;
			default:
				return animMngr;
		}
	}

	determineModalDisplay(isOpen, animMngrObj) {
		if (isOpen) {
			animMngrObj.tl.play();
		} else {
			animMngrObj.tl.reverse();
		}
	}

	render() {
		return (
			<div ref={e => this.sideModalCntr = e} className={this.props.cssClassName}>
				{this.props.children}
			</div>
		);
	}
}

SideModal.propTypes = {
	children: PropTypes.node,
	cssClassName: PropTypes.string.isRequired,
	location: PropTypes.string,
	isOpen: PropTypes.bool.isRequired
};

export default SideModal;
