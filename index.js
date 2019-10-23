const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const Strategy = require('passport-local').Strategy;
require('dotenv').config();

var app = express();
var http = require('http').createServer(app);

require('./models/mongoose');

passport.use(
	new Strategy((username, password, callback) => {
		if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
			return callback(null, false);
		}
		const user = {
			id: process.env.ADMIN_ID,
			name: 'admin'
		};
		return callback(null, user);
	})
);

passport.serializeUser((user, callback) => {
	callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
	if (id === process.env.ADMIN_ID) {
		const user = {
			id,
			name: 'admin'
		};
		return callback(null, user);
	} else {
		return callback('Unautherized');
	}
});

if (process.env.NODE_ENV === 'production') {
	mongoose.connect(
		`mongodb://${process.env.ADMIN_USERNAME}:${process.env
			.ADMIN_DBPASS}@vote19.ituwcssa.com:27017/voting-system-2019?authSource=admin`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	);
} else {
	mongoose.connect('mongodb://localhost/voting-system-2019', { useNewUrlParser: true, useUnifiedTopology: true });
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('DB Connected');
	runApp();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1);
app.use(
	session({
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 36000000,
			// httpOnly: true,
			// domain: 'ituwcssa.com',
			sameSite: true,
			secure: false
		}
	})
);
app.use(passport.initialize());
app.use(passport.session());

const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

app.get('/', (req, res) => {
	res.render('home');
});

require('./routes/authRoutes')(app, passport);

app.use('/admin', ensureLoggedIn('/login'));

var drawObj = new Object({
	state: 0,
	winner: null
});

const SingleMatch = require('./models/matches/SingleMatch');

var Match = new SingleMatch();

require('./routes/adminRoutes')(app, drawObj, Match);

require('./routes/drawRoutes')(app, drawObj);

const CandidateHelper = require('./utils/CandidateHelper');

app.get('/candidates', async (req, res) => {
	var candidates = await CandidateHelper.getAllCandidates();
	candidates.sort((a, b) => a.id > b.id);
	res.send(candidates);
});

app.get('/curcandidate', async (req, res) => {
	var candidate = await Match.getCurrentCandidate();
	res.send(candidate);
});

app.get('/displaycandidates', async (req, res) => {
	var candidates = await Match.getCandidatesToDisplay();
	res.send(candidates);
});

const TwilioHelper = require('./utils/TwilioHelper');
const VoteHelper = require('./utils/VoteHelper');

app.post('/sms', (req, res) => {
	var newVote = TwilioHelper.parseMessage(req.body);
	var from = newVote.number;
	var timestamp = newVote.timestamp;
	VoteHelper.handleNewVote(from, timestamp, Match);
	res.status(200).end();
});

function runApp() {
	const PORT = process.env.PORT || 4000;

	http.listen(PORT, () => {
		console.log(`Listening on PORT ${PORT}`);
	});
}
