const db = require('../services/db');

exports.create = profile => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO profile SET ?'
				return connection.query(sql, profile);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};

exports.findOne = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM profile WHERE profile.?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
};

exports.findOneWithPicture = async (data) => {
	try {
		const connection = await db.get();
		const sql = `
			SELECT
				profile.*,
				pictures.src AS picture
			FROM profile
				LEFT JOIN pictures
					ON pictures.id = profile.picture_id
			WHERE profile.?
		`;
		const rows = await connection.query(sql, data);
		return rows[0];
	} catch (e) {
		throw e;
	}
}

exports.isOnline = async (user_id) => {
	console.log('user_id', user_id);
	try {
		const connection = await db.get();

		const sql = 'SELECT online, last_seen FROM profile WHERE user_id = ?'
		const result = await connection.query(sql, user_id);

		return result[0];
	} catch (e) {
		throw e;
	}
}

exports.update = (dataToFind, dataToUpdate) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let data = [dataToUpdate, dataToFind];
				let sql = 'UPDATE profile SET ? WHERE ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};
