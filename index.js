const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
var swig = require('swig');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Express Session Config
app.use(session({
    secret: 'potato cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Express Messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Load View Engine
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Set Views Folder
app.set('views', path.join(__dirname, 'views'));



/*
    Routes
*/

app.get('/', function (req, res) {
    req.flash('succes', 'Henlo!');
    res.render('home');
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.get('/register', function (req, res) {
    res.render('register', {title: 'Register'});
});

app.listen(process.env.port || 5000, function () {
    console.log('now listening for requests');
});
