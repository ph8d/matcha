const db = require('../services/db');

exports.findAll = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM tags WHERE ?'
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows);
			})
			.catch(reject);
	});
}

exports.findOne = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'SELECT * FROM tags WHERE ?'
				return connection.query(sql, data);
			})
			.then(rows => {
				resolve(rows[0]);
			})
			.catch(reject);
	});
}

exports.add = tag => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'INSERT INTO tags SET ?';
				return connection.query(sql, tag);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
}

exports.insertMultiple = (user_id, tags) => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				const sql = 'INSERT INTO tags (user_id, value) VALUES ?';
				const values = [];
				tags.forEach(value => {
					values.push([ user_id, value ]);
				});
				return connection.query(sql, [values]);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	})
}

exports.delete = data => {
	return new Promise((resolve, reject) => {
		db.get()
			.then(connection => {
				let sql = 'DELETE FROM tags WHERE ?';
				return connection.query(sql, data);
			})
			.then(result => {
				resolve(result);
			})
			.catch(reject);
	});
};