const db = require('../services/db');
const Profile = require('./profile');
const BlockList = require('./block_list');
const socketServer = require('../lib/socketServer');

exports.add = async (type_id, subject_user, actor_user) => {
	const isBlocked = await BlockList.isBlocked(subject_user, actor_user);
	if (isBlocked) return null;

	const connection = await db.get();

	let sql = `
		INSERT INTO notifications
		SET ?
		ON DUPLICATE KEY
			UPDATE seen = 0
	`;

	const values = {
		type_id,
		subject_user,
		actor_user
	}

	const result = await connection.query(sql, values);

	sql = `
		SELECT
			notifications.id,
			notifications.type_id,
			notifications.actor_user,
			pictures.src AS picture,
			first_name,
			last_name,
			login,
			seen,
			notifications.date
		FROM notifications
			INNER JOIN profile
				ON profile.user_id = notifications.actor_user
			LEFT JOIN pictures
				ON pictures.id = profile.picture_id
		WHERE type_id = ? AND subject_user = ? AND actor_user = ?
		ORDER BY notifications.id DESC
	`;
	const rows = await connection.query(sql, [type_id, subject_user, actor_user]);
	if (type_id !== 3) {
		await Profile.recalculateFameRatingById(subject_user);
	}
	socketServer.notifyUser(subject_user, rows[0]);
	return result;
}

exports.getAllByUserId = async user_id => {
	const connection = await db.get();
	sql = `
		SELECT
			notifications.id,
			notifications.type_id,
			notifications.actor_user,
			pictures.src AS picture,
			first_name,
			last_name,
			login,
			seen,
			notifications.date
		FROM notifications
			INNER JOIN profile
				ON profile.user_id = notifications.actor_user
			LEFT JOIN pictures
				ON pictures.id = profile.picture_id
		WHERE subject_user = ?
		ORDER BY notifications.date DESC
	`;
	const rows = await connection.query(sql, user_id);
	return rows;
}

exports.setAllSeenByUserId = async user_id => {
	const connection = await db.get();
	sql = `
		UPDATE notifications
		SET seen = 1
		WHERE subject_user = ?
	`;
	const result = await connection.query(sql, user_id);
	return result;
}
