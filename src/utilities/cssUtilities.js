/**
 * Add CSS classname to string array.  Return new array
 * @method
 * @param {cssClasses} array - Array of CSS class names
 * @param {addClass} string - Name of the CSS class to be added to the new array
 */
export function addCSSClass(cssClasses, addClass) {
	return [...cssClasses.split(' '), addClass].join(' ');
}

/**
 * Remove CSS classname from an array.  Return new array
 * @method
 * @param {cssClasses} array - Array of CSS class names
 * @param {removeClass} string - Name of the CSS class to be removed from the new array
 */
export function removeCSSClass(cssClasses, removeClass) {
	return cssClasses.split(' ').filter(className => className !== removeClass).join(' ');
}
