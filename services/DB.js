const mysql = require('mysql');
const config = require('../config');

class DataBase {
    constructor() {
        this._pool = mysql.createPool(config.mysql);
    };

    get pool() { return this._pool };
}

module.exports = DataBase;