function isLength(str, options) {
	var min = undefined;
	var max = undefined;

	min = options.min;
	max = options.max;
	
	var len = str.length;

	// If max value was not provided it will be ignored
	return len >= min && (typeof max === 'undefined' || len <= max);
};

module.exports = isLength;