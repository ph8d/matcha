function isAlphanum(str) {
	let alphanum = new RegExp('/^[0-9A-Z]+$/i')
	return alphanum.test(str);
};

module.exports = isAlphanum;