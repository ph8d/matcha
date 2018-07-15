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

		req.validateBody = function(param, validators, errorMsg) {

			var data = req.body[param];

			if (typeof data === 'undefined') {
				req._validatorErrors.push("Validation error: no such variavle (" + param + ")");
			}

			console.log("Data: " + data);

		};

		next();
	};
};

module.exports = simpleValidator;