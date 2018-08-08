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
				let sql = 'SELECT * FROM profile WHERE ?';
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
				let sql = 'UPDATE profile SET ? WHERE ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};
