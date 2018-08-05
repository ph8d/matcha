const db = require('../services/db');

exports.findAll = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM interests WHERE ?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};

exports.add = interest => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO interests SET ?';
				return connection.query(sql, interest);
			})
			.then(result => {
				resolve(result.insertId);
			})
			.catch(reject);
	});
};

exports.delete = interest => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {

				// This query removes all rows with same user_id & value
				// because there is no unique index in the table
				
				let sql = 'DELETE FROM interests WHERE user_id = ? AND value = ?';
				return connection.query(sql, [interest.user_id, interest.value]);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};