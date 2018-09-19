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

exports.isBlocked = async (currentUser, otherUser) => {
	try {
		const connection = await db.get();
		const sql = 'SELECT COUNT(*) as count FROM block_list WHERE user_id = ? AND blocked_id = ?';
		const result = await connection.query(sql, [currentUser, otherUser]);
		return result[0].count;
	} catch (e) {
		throw e;
	}
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
