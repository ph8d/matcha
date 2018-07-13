const express = require('express');
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gjrf123',
    database: 'matcha',
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));


app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


function formValidation(formData) {
    // RegExp form validation here
}

app.get('/', (req, res) => {
    res.render('home');
});

app.all('/register', (req, res, next) => {
    let error = '';
    let formData = {
        login: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        confirm_password: '',
    }

    if (req.method === 'POST' && req.body.submit === 'OK') {
        formData.login = req.body.login;
        formData.email = req.body.email;
        formData.first_name = req.body.first_name;
        formData.last_name = req.body.last_name;
        formData.password = req.body.password;
        formData.confirm_password = req.body.confirm_password;

        error = formValidation(formData);

        if (!!error) {
            req.flash('danger', error);
        } else {
            req.flash('success', 'Registration successful! Please, check your email.');
            res.redirect('/');
            return;
        }
    }
    res.render('register', {title: 'Register', form: formData});
});

app.listen(process.env.port || 5000, () => {
    console.log('now listening for requests');
});


/*
    Testing DB
*/ 

app.get('/about', (req, res) => {
    db.query("SELECT * FROM user", function(error, rows, fields) {
        if (!!error) {
            console.log("Error in the query: " + error);
        } else {
            console.log(rows);
        }
    });
    res.render('about');
});

app.get('/about/:name', (req, res) => {
    let user = {
        login: req.params.name,
        email: "123@gmail.com",
        first_name: 'Petro',
        last_name: 'E',
        password: 'sa234klgjnsf234gjkn348950'
    };
    let sql = 'INSERT INTO user SET ?';
    let query = db.query(sql, user, (error, result) => {
        if (!!error) {
            console.log("Error in the query: " + error);
        } else {
            console.log(result);
        }
    });
    res.render('about');
});
