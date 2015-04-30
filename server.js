#!/bin/env node

var express = require('express');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var pwhash = require('password-hash');
var session = require('client-sessions');
var Q = require('q');

var App = function() {

	// Scope
	var self = this;

	// Set up constants
	self.ipaddr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
	self.port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
	self.mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';
	self.mongoPort = parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT) || 27017;
	self.mongoDbName = process.env.OPENSHIFT_APP_NAME || 'hockey'
	self.dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'user';
	self.dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'pass';

	// Mongoose setup

	var Schema = mongoose.Schema;

	var mongoConnectionString = "mongodb://" + self.dbUser + ":" + self.dbPass + "@" + self.mongoHost + ":" + self.mongoPort + "/" + self.mongoDbName;
	mongoose.connect(mongoConnectionString);

	var db = mongoose.connection;

	db.on('error', console.error);

	var accountSchema = new Schema({
		username: {
			type: String,
			unique: true
		},
		password: String,
		permissions: [String]
	});

	accountSchema.plugin(uniqueValidator);

	var playerSchema = new Schema({
		name: {
			type: String,
			unique: true
		},
		active: Boolean,
		gamesPlayed: Number
	});

	playerSchema.plugin(uniqueValidator);

	var teamSchema = new Schema({
		name: {
			type: String,
			unique: true
		},
		roster: [{
			type: Schema.Types.ObjectId,
			ref: 'Player'
		}]
	});

	teamSchema.plugin(uniqueValidator);

	var goalSchema = new Schema({
		scorer: Schema.Types.ObjectId,
		assister: Schema.Types.ObjectId,
		game: Schema.Types.ObjectId
	});

	var gameSchema = new Schema({
		date: Date,
		blue: Schema.Types.ObjectId,
		bluePlayedGames: {
			forwards: [Schema.Types.ObjectId],
			defense: [Schema.Types.ObjectId],
			goalies: [Schema.Types.ObjectId]
		},
		blueScore: Number,
		red: Schema.Types.ObjectId,
		redPlayedGames: {
			forwards: [Schema.Types.ObjectId],
			defense: [Schema.Types.ObjectId],
			goalies: [Schema.Types.ObjectId]
		},
		redScore: Number
	});

	var Account = mongoose.model('Account', accountSchema);
	var Player = mongoose.model('Player', playerSchema);
	var Team = mongoose.model('Team', teamSchema);
	var Goal = mongoose.model('Goal', goalSchema);
	var Game = mongoose.model('Game', gameSchema);

	new Player({
		name: "player1",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});
	new Player({
		name: "player2",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});
	new Player({
		name: "player3",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});
	new Player({
		name: "player4",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});
	new Player({
		name: "player5",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});
	new Player({
		name: "player6",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});
	new Player({
		name: "player7",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});
	new Player({
		name: "player8",
		active: true,
		gamesPlayed: 0
	}).save(function(err, player) {
		console.log(err);
		console.log(player)
	});

	new Team({
		name: "team1",
		roster: [mongoose.Types.ObjectId("553fdd18bdabb04213601e88"),
			mongoose.Types.ObjectId("553fdde857c10748138e5d5d")
		]
	}).save(function(err, team) {
		console.log(err);
		console.log(team)
	});
	new Team({
		name: "team2",
		roster: [mongoose.Types.ObjectId("553fdde857c10748138e5d62"),
			mongoose.Types.ObjectId("553fdde857c10748138e5d5f")
		]
	}).save(function(err, team) {
		console.log(err);
		console.log(team)
	});
	new Team({
		name: "team3",
		roster: [mongoose.Types.ObjectId("553fdde857c10748138e5d60"),
			mongoose.Types.ObjectId("553fdde857c10748138e5d61")
		]
	}).save(function(err, team) {
		console.log(err);
		console.log(team)
	});
	new Team({
		name: "team4",
		roster: [mongoose.Types.ObjectId("553fdde857c10748138e5d5e"),
			mongoose.Types.ObjectId("553fdde857c10748138e5d63")
		]
	}).save(function(err, team) {
		console.log(err);
		console.log(team)
	});

	new Game({
		date: new Date(),
		blue: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0b"),
		bluePlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdde857c10748138e5d62")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d5f")],
			goalies: []
		},
		blueScore: 2,
		red: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0c"),
		redPlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdde857c10748138e5d60")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d61")],
			goalies: []
		},
		redScore: 1
	}).save(function(err, game) {
		console.log(err);
		console.log(game)
	});

	new Game({
		date: new Date(),
		blue: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0a"),
		bluePlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdd18bdabb04213601e88")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d5d")],
			goalies: []
		},
		blueScore: 2,
		red: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0d"),
		redPlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdde857c10748138e5d5e")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d63")],
			goalies: []
		},
		redScore: 1
	}).save(function(err, game) {
		console.log(err);
		console.log(game)
	});

	new Game({
		date: new Date(),
		blue: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0b"),
		bluePlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdde857c10748138e5d62")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d5f")],
			goalies: []
		},
		blueScore: 2,
		red: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0a"),
		redPlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdd18bdabb04213601e88")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d5d")],
			goalies: []
		},
		redScore: 1
	}).save(function(err, game) {
		console.log(err);
		console.log(game)
	});

	new Game({
		date: new Date(),
		blue: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0c"),
		bluePlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdde857c10748138e5d60")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d61")],
			goalies: []
		},
		blueScore: 2,
		red: mongoose.Types.ObjectId("553fe4fb4b81ac0214520f0d"),
		redPlayedGames: {
			forwards: [mongoose.Types.ObjectId("553fdde857c10748138e5d5e")],
			defense: [mongoose.Types.ObjectId("553fdde857c10748138e5d63")],
			goalies: []
		},
		redScore: 1
	}).save(function(err, game) {
		console.log(err);
		console.log(game)
	});

	// End Mongoose Setup

	// Routes
	self.routes = {};

	// Root
	self.routes['root'] = function(req, res) {
		res.render('home', {
			title: 'Home'
		});
	};

	// Health
	self.routes['health'] = function(req, res) {
		res.send('1');
	};

	// Session
	self.routes['session'] = function(req, res) {
		if (req.session && req.session.account) {
			res.send(req.session.account.username);
		} else {
			res.send("No valid session");
		}
	};

	// Registration form
	self.routes['register'] = function(req, res) {
		res.render('register', {
			title: 'Register'
		});
	};

	// Registration form submit
	self.routes['try-register'] = function(req, res) {
		var username = req.body.username;
		var password = req.body.password;
		var hashedPassword = pwhash.generate(password);

		var account = new Account({
			username: username,
			password: hashedPassword,
			permissions: []
		});

		account.save(function(err, account) {
			if (account) {
				res.send(true);
			} else {
				res.send(false);
			}
		});
	};

	// Login form
	self.routes['login'] = function(req, res) {
		res.render('login', {
			title: 'Login'
		});
	};

	// Login form submit
	self.routes['try-login'] = function(req, res) {
		var username = req.body.data.username;
		var password = req.body.data.password;

		Account.findOne({
			username: username
		}, function(err, account) {
			if (account) {
				if (pwhash.verify(password, account.password)) {
					req.session.account = account;
					res.redirect('/dashboard');
				} else {
					res.redirect('/');
				}
			} else {
				res.redirect('/');
			}
		});
	};

	// Dashboard
	self.routes['dashboard'] = function(req, res) {
		if (req.session && req.session.account) {
			res.render('dashboard', {
				title: 'Dashboard',
				username: req.session.account.username
			});
		} else {
			res.redirect('/');
		}
	};

	// Logout
	self.routes['try-logout'] = function(req, res) {
		req.session.reset();
		res.redirect('/');
	};

	// Games display page
	self.routes['games'] = function(req, res) {
		Game.find({}, function(err, games) {
			if (!games) games = [];
			res.render('games', {
				title: "Games",
				games: games
			});
		});
	};

	// Players display page
	self.routes['players'] = function(req, res) {
		Player.find({}, function(err, players) {
			if (!players) players = [];
			res.render('players', {
				title: "Players",
				players: players
			});
		});
	};

	// Teams display page
	self.routes['teams'] = function(req, res) {
		Team.find({}, function(err, teams) {
			if (!teams) teams = [];
			res.render('teams', {
				title: "Teams",
				teams: teams
			});
		});
	};

	// Goals display page
	self.routes['goals'] = function(req, res) {
		Goal.find({}, function(err, goals) {
			if (!goals) goals = [];
			res.render('goals', {
				title: "Goals",
				goals: goals
			});
		});
	};

	// Goal submission form
	self.routes['submit-goals'] = function(req, res) {
		Player.find({
			active: true
		}, function(err, players) {
			if (!players) players = [];
			res.render('submit-goals', {
				title: 'Submit Goals',
				players: players
			});
		});
	};

	// Goal submit
	self.routes['try-submit-goals'] = function(req, res) {
		var scorer = req.body.data.scorer;
		var assister = req.body.data.assister;
		var game = req.body.data.game;

		Player.findOne({
			username: scorer
		}, function(err, scorerDoc) {
			Player.findOne({
				username: assister
			}, function(err, assisterDoc) {});
		});
	};

	// Test revision homepage
	self.routes['revision-home'] = function(req, res) {
		res.render('finalhome', {
			title: "Home"
		});
	}

	// Create app
	self.app = express();

	// Serve static files from /public
	self.app.use(express.static(__dirname + '/public'));

	// Set up app to use jade
	self.app.set('views', __dirname + '/views')
	self.app.set('view engine', 'jade')

	var bodyParser = require('body-parser');

	self.app.use(bodyParser.json()); // to support JSON-encoded bodies
	self.app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
		extended: true
	}));

	// Mozilla session middleware
	self.app.use(session({
		cookieName: 'session',
		secret: 'random_string_goes_here',
		duration: 30 * 60 * 1000,
		activeDuration: 5 * 60 * 1000,
	}));

	// URL Mappings
	self.app.get('/', self.routes['root']);
	self.app.get('/health', self.routes['health']);
	self.app.get('/session', self.routes['session']);
	self.app.get('/register', self.routes['register']);
	self.app.post('/try-register', self.routes['try-register']);
	self.app.get('/login', self.routes['login']);
	self.app.get('/dashboard', self.routes['dashboard']);
	self.app.post('/try-login', self.routes['try-login']);
	self.app.get('/try-logout', self.routes['try-logout']);
	self.app.get('/submit-goals', self.routes['submit-goals']);
	self.app.post('/try-submit-goals', self.routes['try-submit-goals']);
	self.app.get('/goals', self.routes['goals']);
	self.app.get('/players', self.routes['players']);
	self.app.get('/teams', self.routes['teams']);
	self.app.get('/games', self.routes['games']);
	self.app.get('/revision-home', self.routes['revision-home']);

	// Any url not previously mapped -> 404
	self.app.get('*', function(req, res) {
		res.status(404).send('HTTP 404');
	});

	// Starting the Node JS server with Express
	self.startServer = function() {
		self.app.listen(self.port, self.ipaddr, function() {
			console.log('%s: Node server started on %s:%d ...', Date(Date.now()), self.ipaddr, self.port);
		});
	}

	// Destructors
	self.terminator = function(sig) {
		if (typeof sig === "string") {
			console.log('%s: Received %s - terminating Node server ...', Date(Date.now()), sig);
			process.exit(1);
		};
		console.log('%s: Node server stopped.', Date(Date.now()));
	};

	process.on('exit', function() {
		self.terminator();
	});

	self.terminatorSetup = function(element, index, array) {
		process.on(element, function() {
			self.terminator(element);
		});
	};

	['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'].forEach(self.terminatorSetup);

};

// Make a new express app
var app = new App();

// Connect to Mongo DB with start server callback
app.startServer();