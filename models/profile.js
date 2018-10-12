const db = require('../services/db');

const sortSQL = {
	distance: 'distance ASC',
	tags: "matched_tags DESC",
	fame: 'profile.fame DESC',
	age: 'age ASC'
}

const getSearchedGenderSQL = (gender) => {
	if (gender === "male") {
		return "profile.gender = 'male'";
	} else if (gender === "female") {
		return "profile.gender = 'female'";
	} else {
		return "profile.gender = 'male' OR profile.gender = 'female'";
	}
}

exports.recalculateFameRatingById = async (user_id) => {
	const connection = await db.get();
	const sql = `
		UPDATE profile
		SET
			fame = (
				SELECT
					SUM(type_id)
				FROM notifications
				WHERE
					subject_user = ?
					AND NOT type_id = 3
			)
		WHERE user_id = ?
	`;
	const result = await connection.query(sql, [user_id, user_id]);
	return result;
}

exports.create = async (profile) => {
	const connection = await db.get();
	const sql = 'INSERT INTO profile SET ?'
	const result = await connection.query(sql, profile);
	return result;
};

exports.findOne = async (data) => {
	const connection = await db.get();
	const sql = 'SELECT * FROM profile WHERE ?';
	const rows = await connection.query(sql, data);
	return rows[0];
};

exports.findOneWithPicture = async (data) => {
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
}

exports.findRecomendedForUser = async (currentUser, filters) => {
	const connection = await db.get();
	const values = [];
	let sql = `
		SELECT
			profile.user_id,
			pictures.src AS picture,
			first_name,
			last_name,
			login,
			gender,
			fame,
			TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
			ST_Distance_Sphere (
				point(?,?),
				point(profile.lat, profile.lng)
			) / 1000 AS distance,
			COUNT( tags.user_id ) AS filter_tags
		FROM (
			SELECT
				profile.user_id,
				COUNT( tags.user_id ) as matched_tags
			FROM profile
				LEFT JOIN tags
					ON tags.user_id = profile.user_id
			WHERE 
				((${getSearchedGenderSQL(currentUser.searching_for)})
				AND (profile.searching_for = ? OR profile.searching_for = '*'))
				AND tags.value IN (
					SELECT tags.value
					FROM tags
					WHERE user_id = ?
				)
				AND NOT profile.user_id = ?
				AND NOT profile.user_id IN (
					SELECT blocked_id
					FROM block_list
					WHERE user_id = ?
				)
			GROUP BY profile.user_id
		) AS recommended
			LEFT JOIN profile
				ON profile.user_id = recommended.user_id
			LEFT JOIN pictures
				ON pictures.id = profile.picture_id
			LEFT JOIN tags
				ON tags.user_id = recommended.user_id
	`;

	values.push(
		currentUser.lat,
		currentUser.lng,
		currentUser.gender,
		currentUser.user_id,
		currentUser.user_id,
		currentUser.user_id
	);

	if (filters.tags) {
		sql += "WHERE tags.value IN ? ";
		values.push([ filters.tags ]);
	}

	sql += `
		GROUP BY
			recommended.user_id
		HAVING
	`;

	if (filters.tags) {
		sql += 'filter_tags = ? AND';
		values.push(filters.tags.length);
	}

	sql += `
		distance BETWEEN ? AND ?
		AND age BETWEEN ? AND ?
		AND fame BETWEEN ? AND ?
	`

	values.push(
		filters.distance[0],
		filters.distance[1],
		filters.age[0],
		filters.age[1],
		filters.fame[0],
		filters.fame[1]
	);


	sql += `ORDER BY ${sortSQL[filters.sortBy]}`;

	const rows = await connection.query(sql, values);
	return rows;
}

exports.findWithFilters = async (currentUser, filters) => {
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
				point(?,?),
				point(profile.lat, profile.lng)
			) / 1000 AS distance,
			COUNT( tags.user_id ) AS matched_tags
		FROM profile
			LEFT JOIN tags
				ON tags.user_id = profile.user_id
			LEFT JOIN pictures
				ON pictures.id = profile.picture_id
		WHERE
			(${getSearchedGenderSQL(filters.gender)})
	`;

	values.push(
		currentUser.lat,
		currentUser.lng
	);

	if (filters.searching_for !== 'any') {
		sql += `
			AND profile.searching_for = ?
		`
		values.push(filters.searching_for);
	}

	sql += `
			AND fame BETWEEN ? AND ?
	`
	values.push(filters.fame[0], filters.fame[1]);

	if (filters.tags) {
		sql += `
			AND tags.value IN ?
		`;
		values.push([ filters.tags ]);
	}

	sql += `
			AND NOT profile.user_id = ?
			AND NOT profile.user_id IN (
				SELECT blocked_id
				FROM block_list
				WHERE user_id = ?
			)
		GROUP BY profile.user_id
		HAVING
	`;

	values.push(currentUser.user_id, currentUser.user_id);

	if (filters.tags) {
		sql += 'matched_tags = ? AND';
		values.push(filters.tags.length)
	}

	sql += `
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

	sql += sortSQL[filters.sortBy];
	const rows = await connection.query(sql, values);
	return rows;
}

exports.findOneAndComputeDistance = async (data, position) => {
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
}

exports.isOnline = async (user_id) => {
	const connection = await db.get();

	const sql = 'SELECT online, last_seen FROM profile WHERE user_id = ?'
	const result = await connection.query(sql, user_id);

	return result[0];
}

exports.update = async (dataToFind, dataToUpdate) => {
	const connection = await db.get();
	const data = [dataToUpdate, dataToFind];
	const sql = 'UPDATE profile SET ? WHERE ?';
	const result = await connection.query(sql, data);
	return result;
};
