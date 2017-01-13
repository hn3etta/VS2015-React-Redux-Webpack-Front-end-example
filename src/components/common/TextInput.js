import React, {PropTypes} from 'react';

const TextInput = ({type, name, label, focus = false, onChange, onKeyPress, placeholder, value, error, disabled = false, containerCssClass, labelCssClass, inputCssClass, errorCssClass}) => {
	return (
		<div className={containerCssClass}>
			<label htmlFor={name} className={labelCssClass}>{label}</label>
			<input
				type={type}
				name={name}
				autoFocus={focus}
				className={inputCssClass}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onKeyPress={onKeyPress}
				disabled={disabled ? 'disabled' : ''}
			/>
			{error && <div className={errorCssClass}>{error}</div>}
		</div>
	);
};

TextInput.propTypes = {
	type: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	focus: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	onKeyPress: PropTypes.func,
	placeholder: PropTypes.string,
	value: PropTypes.string,
	error: PropTypes.string,
	disabled: PropTypes.bool,
	containerCssClass: PropTypes.string.isRequired,
	labelCssClass: PropTypes.string.isRequired,
	inputCssClass: PropTypes.string.isRequired,
	errorCssClass: PropTypes.string.isRequired
};

export default TextInput;
