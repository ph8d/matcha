const mysql = require('promise-mysql');
const config = require('../config/db');

var state = {
	pool: null
};

exports.connect = () => {
	state.pool = mysql.createPool(config);
};

exports.get = () => {
	return new Promise((resolve, reject) => {
		if (!state.pool) {
			reject(new Error('Missing database connection'));
		} else {
			resolve(state.pool)
		}
	});
};

exports.getPool = () => {
	return state.pool;
};