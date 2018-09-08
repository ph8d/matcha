const db = require('../services/db');

exports.add = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO reported_users SET ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
}

exports.findOne = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM reported_users WHERE ?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
}

exports.findAll = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM reported_users WHERE ?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
}