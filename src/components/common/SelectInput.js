/* Use "require" for non ES6 Modules */
let React = require('react');
let PropTypes = React.PropTypes;


const SelectInput = ({name, label, onChange, defaultOption, value, error, options, containerCssClass, labelCssClass, selectCssClass, errorCssClass}) => {
    return (
        <div className={containerCssClass}>
            <label htmlFor={name} className={labelCssClass}>{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={selectCssClass}>
                <option value="-1">{defaultOption}</option>
                {options.map(option => <option key={option.get("value")} value={option.get("value")}>{option.get("text")}</option>)}
            </select>
            {error && <div className={errorCssClass}>{error}</div>}
        </div>
    );
};

SelectInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultOption: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    options: PropTypes.object,
    containerCssClass: PropTypes.string.isRequired,
    labelCssClass: PropTypes.string.isRequired,
    selectCssClass: PropTypes.string.isRequired,
    errorCssClass: PropTypes.string.isRequired
};

export default SelectInput;