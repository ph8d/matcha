const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader === 'undefined') {
		res.sendStatus(401);
	} else {
		const bearerToken = bearerHeader.split(' ')[1];
		jwt.verify(bearerToken, 'SECRET_KEY_THAT_I_NEED_TO_REPLACE_LATER', (error, payload) => {
			if (error) {
				res.sendStatus(401);
			} else {
				req.user = {
					id: payload.userId,
					login: payload.login
				}
				next();
			}
		});
	}
};