function isEmail(str) {
	// Fucking insane regexp for emails that i found on http://emailregex.com/
	var isValidEmail = new RegExp ('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');
	return isValidEmail.test(str);
};

module.exports = isEmail;