function matches(str, pattern) {
	pattern = new RegExp(pattern);
	return pattern.test(str);
}

module.exports = matches;