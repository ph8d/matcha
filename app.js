const express = require('express');
const bodyParser = require('body-parser');
const mailer = require('express-mailer')
const path = require('path');
const db = require('./services/db');


const user = require('./controllers/user');
const users = require('./controllers/users');
const interests = require('./controllers/interests');
const pictures = require('./controllers/pictures');

const app = express();
const config = require('./config/express');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

db.connect();

mailer.extend(app, require('./config/mailer'));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

app.use('/user', user);
app.use('/users', users);
app.use('/interests', interests);
app.use('/pictures', pictures);

app.listen(config.port, () => {
	console.log('Server started at port ' + config.port);
});
