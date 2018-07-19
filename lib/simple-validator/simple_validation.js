var myValidator = require('./my_validator');

var simpleValidation = function() {
	return function(req, res, next) {

		req._validatorErrors = Array();

		req.validatorErrors = function() {
			var result = req._validatorErrors;
			if (Array.isArray(result) && result.length > 0) {
				return result;
			} else {
				return false;
			}
		};
		req.validate = function(param, validators, errorMsg) {
			console.log(typeof validators);
			if (Array.isArray(validators)) {
				validators.forEach(function (validationFunc) {
					if (!validationFunc(param)) {
						req._validatorErrors.push(errorMsg);
					}
				});
			} else if (typeof validators === 'function') {
				if (!validators(param)) {
					req._validatorErrors.push(errorMsg);
				}
			} else {
				req._validatorErrors.push("Validator error: invalid argument [validators].");
			}
		};

		next();
	};
};

module.exports = simpleValidation;