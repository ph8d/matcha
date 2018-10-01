const db = require('../services/db');

exports.findOne = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM pictures WHERE ?';
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
				let sql = 'SELECT * FROM pictures WHERE ?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};

exports.findAllByUserIdArranged = async (user_id) => {
	try {
		const connection = await db.get();
		const sql = `
			SELECT *
			FROM pictures
			WHERE user_id = ?
			ORDER BY id IN (
				SELECT picture_id
				FROM profile
				WHERE user_id = ?
			) DESC, id ASC
		`;
		const rows = await connection.query(sql, [user_id, user_id]);
		return rows;
	} catch (e) {
		throw e;
	}
}

exports.add = picture => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO pictures SET ?';
				return connection.query(sql, picture);
			})
			.then(result => {
				resolve(result);
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
