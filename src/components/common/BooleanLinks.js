import React, {PropTypes} from 'react';

const BooleanLinks = ({containerCssClass, labelCssClass, labelText, trueCssClass, trueText, trueClick, trueSelected, falseCssClass, falseText, falseClick, selectedCssModifier}) => {
	function getCSSClass(isTrueElm, trueSelected, cssClassName, cssModifier) {
		if (isTrueElm && trueSelected) {
			return cssClassName + ' ' + cssClassName + cssModifier;
		}

		if (!isTrueElm && !trueSelected) {
			return cssClassName + ' ' + cssClassName + cssModifier;
		}

		return cssClassName;
	}

	return (
		<div className={containerCssClass}>
			<label className={labelCssClass}>{labelText}</label>
			<a href="#" className={getCSSClass(true, trueSelected, trueCssClass, selectedCssModifier)} onClick={trueClick}>{trueText}</a>
			<a href="#" className={getCSSClass(false, trueSelected, falseCssClass, selectedCssModifier)} onClick={falseClick}>{falseText}</a>
		</div>
	);
};

BooleanLinks.propTypes = {
	containerCssClass: PropTypes.string,
	labelCssClass: PropTypes.string,
	labelText: PropTypes.string,
	trueCssClass: PropTypes.string,
	trueText: PropTypes.string.isRequired,
	trueClick: PropTypes.func.isRequired,
	trueSelected: PropTypes.bool.isRequired,
	falseCssClass: PropTypes.string,
	falseText: PropTypes.string.isRequired,
	falseClick: PropTypes.func.isRequired,
	selectedCssModifier: PropTypes.string.isRequired
};

export default BooleanLinks;
