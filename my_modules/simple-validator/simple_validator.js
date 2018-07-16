var validator = require('./my_validator');

var simpleValidator = function() {
	return function(req, res, next) {

		req._validatorErrors = Array();

		req.validatorErrors = function() {
			var result = req._validatorErrors;
			if (result.isArray() && result.length > 0) {
				return result;
			} else {
				return false;
			}
		};

		req.validate = function(param, errorMsg) {

		};

		next();
	};
};

module.exports = simpleValidator;