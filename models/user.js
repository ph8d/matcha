const db = require('../services/db');
const crypto = require('crypto');

exports.logAll = () => {
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

exports.getAll = () => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM user';
				return connection.query(sql);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
};

exports.add = (user) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO user SET ?';
				return connection.query(sql, user);
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
				let sql = 'SELECT * FROM user WHERE ?';
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
};

exports.update = (dataToFind, dataToUpdate) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let data = [dataToUpdate, dataToFind];
				let sql = 'UPDATE user SET ? WHERE ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};

exports.genRecoveryRequest = userId => {
	return new Promise((resolve, reject) => {
		let hash = crypto.randomBytes(20).toString('hex');
		db.get()
			.then(connection => {
				let data = {
					id: hash,
					user_id: userId
				}
				let sql = 'INSERT recovery_requests SET ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(hash);
			})
			.catch(reject);
	});
};

exports.findRecoveryRequest = hash => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM recovery_requests WHERE id = ?';
				return connection.query(sql, hash);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
};

exports.delAllRecoveryRequestsByUserId = userId => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'DELETE FROM recovery_requests WHERE user_id = ?';
				return connection.query(sql, userId);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};
