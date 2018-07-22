// I need to fix this repeating code for error handling

exports.logAllUsers = (dbConnection) => {
    let sql = 'SELECT * FROM user';
    dbConnection.query(sql, (error, rows, fields) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(rows);
            return true;
        }
    });  
};

exports.add = (user, dbConnection) => {
    let sql = 'INSERT INTO user SET ?';
    let query = dbConnection.query(sql, user, (error, result) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(result);
            return true;
        }
    });
};

exports.getOneById = (userId, dbConnection) => {
    let sql = 'SELECT * FROM user WHERE id = ?';
    let query = dbConnection.query(sql, userId, (error, rows, fields) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(result);
            return true;
        }
    });
}

exports.getOneByLogin = (userLogin, dbConnection) => {
    let sql = 'SELECT * FROM user WHERE login = ?';
    let query = dbConnection.query(sql, userLogin, (error, rows, fields) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(result);
            return true;
        }
    });
}