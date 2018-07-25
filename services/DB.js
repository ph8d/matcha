const mysql = require('mysql');
const config = require('../config/db');

var state = {
    pool: null
};

exports.connect = () => {
    state.pool = mysql.createPool(config);
};

exports.get = () => {
    return new Promise((resolve, reject) => {
        var pool = state.pool;
        if (!pool) {
            throw new Error('Database connection error.');
        }
        pool.getConnection((error, connection) => {
            if (error) {
                throw error;         
            }
            resolve(connection);
        }); 
    });
};

exports.getPool = () => {
    return state.pool;
}