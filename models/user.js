// I need to fix this repeating code for error handling
// And also i need to decide how to pass query results farther, by callback functions or by promises

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

exports.getOneByLoginInformation = (loginInfo, dbConnection) => {
    let sql = 'SELECT * FROM user WHERE login = ? AND password = ?'
    let query = dbConnection.query(sql, loginInfo, (error, rows, fields) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(rows);
            if (rows.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    });
    return true;
};

exports.getOneById = (userId, dbConnection) => {
    let sql = 'SELECT * FROM user WHERE id = ?';
    let query = dbConnection.query(sql, userId, (error, rows, fields) => {
        if (!!error) {
            console.log("Error in the query: " + error);
            return false;
        } else {
            console.log(rows);
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
            console.log(rows);
            return true;
        }
    });
}