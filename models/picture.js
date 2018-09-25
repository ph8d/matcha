const db = require('../services/db');
const fs = require('fs');

const deleteMultipleFiles = files => {
	return new Promise((resolve, reject) => {
		let i = files.length;
		files.forEach(function(file) {
			fs.unlink(file, function(err) {
				i--;
				if (err) {
					return reject(err);
				} else if (i <= 0) {
					resolve();
				}
			});
		});
	});
}

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

exports.deleteMultiple = async (idArray) => {
	try {
		const connection = await db.get();
		let sql = 'SELECT absolute_path FROM pictures WHERE id IN ?'

		const pictures = await connection.query(sql, [[idArray]]);
		const paths = [];
		pictures.forEach(picture => {
			paths.push(picture.absolute_path);
		});

		await deleteMultipleFiles(paths);

		sql = 'DELETE FROM pictures WHERE id IN ?'
		const result = await connection.query(sql, [[idArray]]);

		return result;
	} catch (e) {
		throw e;
	}
}
