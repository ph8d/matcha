const db = require('../services/db');

exports.find = data => {
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

exports.remove = someDataToFindRightInterest => {
	/* Remove the interest */
};