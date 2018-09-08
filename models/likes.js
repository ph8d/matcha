const db = require('../services/db');


exports.add = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO likes SET ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};

exports.delete = (user_id, liked_user_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'DELETE FROM likes WHERE user_id = ? AND liked_user_id = ?';
				return connection.query(sql, [user_id, liked_user_id]);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};

exports.findAllByUserId = id => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM likes WHERE ? IN (user_id, liked_user_id)';
				return connection.query(sql, id);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};

exports.findOne = (user_id, liked_user_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = `SELECT * FROM likes WHERE user_id = ? AND liked_user_id = ?`;
				return connection.query(sql, [user_id, liked_user_id]);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
}

exports.isMatch = (user_one_id, user_two_id) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = `
					SELECT COUNT(*) as count
					FROM likes
						INNER JOIN likes AS liked_me
							ON likes.user_id = liked_me.liked_user_id
								AND likes.liked_user_id = liked_me.user_id
					WHERE likes.user_id = ? AND liked_me.user_id = ?
				`;
				return connection.query(sql, [user_one_id, user_two_id]);
			})
			.then(result => {
				resolve(result[0].count);
			})
			.catch(reject);
	});
}

exports.findAllMatchesByUserId = id => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = `
					SELECT liked_me.user_id
					FROM likes
						INNER JOIN likes AS liked_me
							ON likes.user_id = liked_me.liked_user_id
								AND likes.liked_user_id = liked_me.user_id
					WHERE likes.user_id = ?
				`;
				return connection.query(sql, id);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};