var _isAlphanum = require('./lib/isAlphanum');

var _isEmail = require('./lib/isEmail');

var _isEmpty = require('./lib/isEmpty');

var _isLength = require('./lib/isLength');

var _matches = require('./lib/matches');

var my_validator = {
	isAlphanum: _isAlphanum,
	isEmail: _isEmail,
	isEmpty: _isEmpty,
	isLength: _isLength,
	matches: _matches
};

module.exports = my_validator;