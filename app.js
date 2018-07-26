const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const router = require('./routes/router');
const path = require('path');
const db = require('./services/db');
const MySQLStore = require('express-mysql-session')(session);

const app = express();
const config = require('./config/express');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

db.connect();
const sessionStore = new MySQLStore({}, db.getPool());

app.use(session({
	secret: 'potato cat',
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 // 24h
	}
}));

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

app.use('/', router);

app.listen(config.port, () => {
	console.log('Server started at port ' + config.port);
});
