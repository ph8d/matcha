var simpleValidator = function() {
	return function(req, res, next) {
		req.validateBody = function(param, validators, errorMsg) {
			console.log(param);
			console.log(validators);
			console.log(param);
			console.log(data);
			
			var data = req.body[param];

			validators.forEach((validator, data) => {
				console.log(validator(data));
			});
		};

		next();
	};
};

module.exports = simpleValidator;