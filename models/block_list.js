const db = require('../services/db');

exports.add = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO block_list SET ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
}

exports.delete = (user_id, blocked_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'DELETE FROM block_list WHERE user_id = ? AND blocked_id = ?';
				return connection.query(sql, [user_id, blocked_id]);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
}

exports.findOne = (user_id, blocked_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM block_list WHERE user_id = ? AND blocked_id = ?';
				return connection.query(sql, [user_id, blocked_id]);
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
				let sql = 'SELECT * FROM block_list WHERE ?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
}
