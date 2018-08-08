const db = require('../services/db');

exports.findAllByUserId = userId => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM pictures WHERE user_id = ?';
				return connection.query(sql, userId);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};

exports.add = picture => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO pictures SET ?';
				return connection.query(sql, picture);
			})
			.then(result => {
				resolve(result.insertId);
			})
			.catch(reject);
	});
};

exports.delete = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'DELETE FROM pictures WHERE ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};
