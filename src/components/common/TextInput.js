﻿/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;


const TextInput = ({type, name, label, focus = false, onChange, onKeyPress, placeholder, value, error, containerCssClass, labelCssClass, inputCssClass, errorCssClass}) => {
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
                onKeyPress={onKeyPress} />
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
    containerCssClass: PropTypes.string.isRequired,
    labelCssClass: PropTypes.string.isRequired,
    inputCssClass: PropTypes.string.isRequired,
    errorCssClass: PropTypes.string.isRequired
};

export default TextInput;