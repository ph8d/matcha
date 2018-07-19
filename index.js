const express = require('express');
const Db = require('./lib/db/Db');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const simpleValidation = require('./lib/simple-validator/simple_validation');
const myValidator = require('./lib/simple-validator/my_validator');
var registerRoutes = require('./routes/registration');

const app = express();
const db = new Db();

app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
	secret: 'potato cat',
	resave: true,
	saveUninitialized: true,
	cookie: {
		maxAge: 60000
	}
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

app.use(simpleValidation());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/about', (req, res) => {
	db.logAllUsers();
	req.flash('danger', 'testing danger msg');
	req.flash('success', 'testing success msg');
	res.render('about');
});

app.get('/about/:name', (req, res) => {
	let user = {
		login: req.params.name,
		email: "Testing",
		first_name: 'Database',
		last_name: 'Class',
		password: 'E'
	};
	db.addUser(user)
	res.render('about');
});

app.use('/register', registerRoutes);

app.listen(process.env.port || 5000, () => {
	console.log('Server started at port 5000!');
});
