const express = require('express');
const bodyParser = require('body-parser');
const mailer = require('express-mailer')
const path = require('path');
const db = require('./services/db');

const users = require('./controllers/users');
const pictures = require('./controllers/pictures');
const conversations = require('./controllers/conversations');
const profiles = require('./controllers/profiles');

const app = express();
const http = require('http').Server(app);
const socketServer = require('./lib/socketServer');

const config = require('./config/express');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

db.connect();

mailer.extend(app, require('./config/mailer'));

app.use('/users', users);
app.use('/conversations', conversations);
app.use('/pictures', pictures);
app.use('/profiles', profiles);

socketServer.init(http);
http.listen(config.port, () => {
	console.log('Server started at port ' + config.port);
});
