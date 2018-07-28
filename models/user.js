const db = require('../services/db');

exports.logAllUsers = () => {
	db.get()
		.then(connection => {
			let sql = 'SELECT * FROM user';
			return connection.query(sql);
		})
		.then(rows => {
			console.log(rows);
		})
		.catch(console.error);
};

exports.add = (user) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO user SET ?';
				return connection.query(sql, user);
			})
			.then(result => {
				resolve(result.insertId);
			})
			.catch(reject);
	});
};

exports.findOne = (data) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM user WHERE ?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
}
