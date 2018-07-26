const mysql = require('mysql');
const config = require('../config/db');

var state = {
    pool: null
};

exports.connect = () => {
    state.pool = mysql.createPool(config);
};

exports.get = (done) => {
    var pool = state.pool;
    if (!pool) {
        return done(new Error('Missing database connection'));
    }
    pool.getConnection((error, connection) => {
        if (error) return done(error);
        done(null, connection);
        console.log('A database connection was used!');
        connection.release();
    });
};

exports.getPool = () => {
    return state.pool;
};