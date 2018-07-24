const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = require('./routes/router');
const passport = require('passport');
const db = require('./services/db');

const app = express();
const config = require('./config/express');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

db.connect();

app.use('/', router);

app.listen(process.env.port || config.port, () => {
	console.log('Server started at port ' + config.port);
});
