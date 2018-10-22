    const jwt = require('jsonwebtoken');

module.exports = (token, callback) => {
    if (!token) {
        return callback(new Error('Auth token is missing.'))
    } else {
        jwt.verify(token, 'SECRET_KEY_THAT_I_NEED_TO_REPLACE_LATER', (error, payload) => {
            if (error) {
                return callback(new Error('Auth token is invalid.'))
            } else {
                const user = { id: payload.userId }
                return callback(false, user);
            }
        });
    }
}