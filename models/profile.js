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

exports.findRecomendedForUser = async (currentUser, filters) => {
	const sortSQL = {
		distance: 'distance ASC',
		tags: 'same_tags_count DESC',
		fame: 'profile.fame DESC',
		age: 'age ASC'
	}

	try {
		const connection = await db.get();
		const values = [];
		let sql = `
			SELECT
				profile.user_id,
				first_name,
				last_name,
				login,
				gender,
				TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
				pictures.src AS picture,
				ST_Distance_Sphere (
					point(?, ?),
					point(profile.lat, profile.lng)
				) / 1000 AS distance,
				COUNT( tags.user_id ) AS same_tags_count
			FROM profile
				LEFT JOIN tags
					ON tags.user_id = profile.user_id
				LEFT JOIN pictures
					ON pictures.id = profile.picture_id
			WHERE 
				profile.gender = ?
				AND profile.searching_for = ?
				AND NOT profile.user_id = ?
				AND fame BETWEEN ? AND ?
		`;

		values.push(
			currentUser.lat,
			currentUser.lng,
			currentUser.searching_for,
			currentUser.gender,
			currentUser.user_id,
			filters.fame[0],
			filters.fame[1],
		)

		if (filters.tags) {
			sql += 'AND tags.value IN ?';
			values.push([ filters.tags ]);
		}

		sql += `
			GROUP BY profile.user_id
			HAVING
				distance BETWEEN ? AND ?
				AND age BETWEEN ? AND ?
			ORDER BY
		`;

		values.push(
			filters.distance[0],
			filters.distance[1],
			filters.age[0],
			filters.age[1]
		);

		// if (filters.sortBy !== "distance") {
			sql += sortSQL[filters.sortBy];
		// }

		// sql += "distance ASC";

		console.log(sql);
		const rows = await connection.query(sql, values);
		console.log(rows);
		return rows;
	} catch (e) {
		throw e;
	}
}

exports.findOneAndComputeDistance = async (data, position) => {
	try {
		const connection = await db.get();
		const sql = `
			SELECT
				profile.*,
				CEIL(
					ST_Distance_Sphere (
						point(?, ?),
						point(profile.lat, profile.lng)
					) / 1000
				) as distance
			FROM profile
			WHERE ?
		`;
		const rows = await connection.query(sql, [position.lat, position.lng, data]);
		return rows[0];
	} catch (e) {
		throw(e);
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
