const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mailer = require('express-mailer')
const path = require('path');
const db = require('./services/db');
const MySQLStore = require('express-mysql-session')(session);
const home = require('./controllers/home');
const users = require('./controllers/users');
const interests = require('./controllers/interests');
const picture = require('./controllers/picture');

const app = express();
const config = require('./config/express');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

db.connect();

app.use(session({
	secret: 'potato cat',
	resave: false,
	saveUninitialized: false,
	store: new MySQLStore({}, db.getPool()),
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 // 24h
	}
}));

mailer.extend(app, require('./config/mailer'));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

//Passport config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('*', (req, res, next) => {
	// Creating a variable that contains true if user is authenticated, otherwise it is false
	res.locals.isAuthenticated = (!!req.user);
	next();
});

app.use('/', home);
app.use('/users', users);
app.use('/interests', interests);
app.use('/picture', picture);

app.listen(config.port, () => {
	console.log('Server started at port ' + config.port);
});
