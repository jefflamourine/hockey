#!/bin/env node

var express = require('express');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var pwhash = require('password-hash');
var session = require('client-sessions');
var Q = require('q');

var DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
		}],
		w: Number,
		otw: Number,
		otl: Number,
		l: Number
	});

	teamSchema.plugin(uniqueValidator);

	var goalSchema = new Schema({
		scorer: {
			type: Schema.Types.ObjectId,
			ref: 'Player'
		},
		assister: {
			type: Schema.Types.ObjectId,
			ref: 'Player'
		},
		game: {
			type: Schema.Types.ObjectId,
			ref: 'Game'
		},
		color: String
	});

	var gameSchema = new Schema({
		date: Date,
		blue: {
			type: Schema.ObjectId,
			ref: 'Team'
		},
		bluePlayedGames: {
			forwards: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}],
			defense: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}],
			goalies: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}]
		},
		blueScore: Number,
		red: {
			type: Schema.ObjectId,
			ref: 'Team'
		},
		redPlayedGames: {
			forwards: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}],
			defense: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}],
			goalies: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}]
		},
		redScore: Number
	});

	var Account = mongoose.model('Account', accountSchema);
	var Player = mongoose.model('Player', playerSchema);
	var Team = mongoose.model('Team', teamSchema);
	var Goal = mongoose.model('Goal', goalSchema);
	var Game = mongoose.model('Game', gameSchema);

	var player1 = new Player({
		name: "Burnwurnum",
		active: true,
		gamesPlayed: 0
	});
	var player2 = new Player({
		name: "BigV",
		active: true,
		gamesPlayed: 0
	});
	var player3 = new Player({
		name: "CrabInATree",
		active: true,
		gamesPlayed: 0
	});
	var player4 = new Player({
		name: "Bojarzin",
		active: true,
		gamesPlayed: 0
	});
	var player5 = new Player({
		name: "Nina",
		active: true,
		gamesPlayed: 0
	});
	var player6 = new Player({
		name: "JLalu",
		active: true,
		gamesPlayed: 0
	});
	var player7 = new Player({
		name: "DvD",
		active: true,
		gamesPlayed: 0
	});
	var player8 = new Player({
		name: "meatsale",
		active: true,
		gamesPlayed: 0
	});
	var player9 = new Player({
		name: "Zam",
		active: true,
		gamesPlayed: 0
	});
	var player10 = new Player({
		name: "Dyaloreax",
		active: true,
		gamesPlayed: 0
	});
	var player11 = new Player({
		name: "Hesse",
		active: true,
		gamesPlayed: 0
	});
	var player12 = new Player({
		name: "pkpaching",
		active: true,
		gamesPlayed: 0
	});
	var player13 = new Player({
		name: "Pet the Pizza",
		active: true,
		gamesPlayed: 0
	});
	var player14 = new Player({
		name: "Superhotglue",
		active: true,
		gamesPlayed: 0
	});
	var player15 = new Player({
		name: "Doucet",
		active: true,
		gamesPlayed: 0
	});
	var player16 = new Player({
		name: "STAEDTLERS",
		active: true,
		gamesPlayed: 0
	});
	var player17 = new Player({
		name: "Fuzzywuzzy",
		active: true,
		gamesPlayed: 0
	});
	var player18 = new Player({
		name: "TaZeR",
		active: true,
		gamesPlayed: 0
	});
	var player19 = new Player({
		name: "NotLead",
		active: true,
		gamesPlayed: 0
	});
	var player20 = new Player({
		name: "Proper Cheeze",
		active: true,
		gamesPlayed: 0
	});
	var player21 = new Player({
		name: "Jarvan",
		active: true,
		gamesPlayed: 0
	});
	var player22 = new Player({
		name: "Kuzy",
		active: true,
		gamesPlayed: 0
	});
	var player23 = new Player({
		name: "DrSlugger",
		active: true,
		gamesPlayed: 0
	});
	var player24 = new Player({
		name: "DrGherms",
		active: true,
		gamesPlayed: 0
	});
	var player25 = new Player({
		name: "Dalfan",
		active: true,
		gamesPlayed: 0
	});
	var player26 = new Player({
		name: "Teemu Salami",
		active: true,
		gamesPlayed: 0
	});
	var player27 = new Player({
		name: "Dick_Doug",
		active: true,
		gamesPlayed: 0
	});
	var player28 = new Player({
		name: "Ticklebox",
		active: true,
		gamesPlayed: 0
	});
	var player29 = new Player({
		name: "Dildozer",
		active: true,
		gamesPlayed: 0
	});
	var player30 = new Player({
		name: "MCJabba69",
		active: true,
		gamesPlayed: 0
	});
	var player31 = new Player({
		name: "5 lim",
		active: true,
		gamesPlayed: 0
	});
	var player32 = new Player({
		name: "Trevkro",
		active: true,
		gamesPlayed: 0
	});
	var player33 = new Player({
		name: "Gretzky",
		active: true,
		gamesPlayed: 0
	});
	var player34 = new Player({
		name: "KS Otto",
		active: true,
		gamesPlayed: 0
	});
	var player35 = new Player({
		name: "Sammy",
		active: true,
		gamesPlayed: 0
	});
	var player36 = new Player({
		name: "Goose",
		active: true,
		gamesPlayed: 0
	});
	var player37 = new Player({
		name: "Tluers",
		active: true,
		gamesPlayed: 0
	});
	var player38 = new Player({
		name: "Quoof",
		active: true,
		gamesPlayed: 0
	});
	var player39 = new Player({
		name: "Austin",
		active: true,
		gamesPlayed: 0
	});
	var player40 = new Player({
		name: "SelfPlug",
		active: true,
		gamesPlayed: 0
	});
	var player41 = new Player({
		name: "Gabe",
		active: true,
		gamesPlayed: 0
	});
	var player42 = new Player({
		name: "kBomb",
		active: true,
		gamesPlayed: 0
	});
	var player43 = new Player({
		name: "GoLeafsGo",
		active: true,
		gamesPlayed: 0
	});
	var player44 = new Player({
		name: "Kapanen",
		active: true,
		gamesPlayed: 0
	});
	var player45 = new Player({
		name: "Tallmidget",
		active: true,
		gamesPlayed: 0
	});
	var player46 = new Player({
		name: "Jake Allen",
		active: true,
		gamesPlayed: 0
	});
	var player47 = new Player({
		name: "NobodyEpic123",
		active: true,
		gamesPlayed: 0
	});
	var player48 = new Player({
		name: "Johnny Hockey",
		active: true,
		gamesPlayed: 0
	});

	var team1 = new Team({
		name: "Winnipeg Jets",
		roster: [player1._id, player2._id, player3._id, player4._id, player5._id, player6._id, player7._id, player8._id],
		w: 0,
		otw: 0,
		otl: 0,
		l: 0
	});
	var team2 = new Team({
		name: "Philadelphia Flyers",
		roster: [player9._id, player10._id, player11._id, player12._id, player13._id, player14._id, player15._id, player16._id],
		w: 0,
		otw: 0,
		otl: 0,
		l: 0
	});
	var team3 = new Team({
		name: "Atlanta Thrashers",
		roster: [player17._id, player18._id, player19._id, player20._id, player21._id, player22._id, player23._id, player24._id],
		w: 0,
		otw: 0,
		otl: 0,
		l: 0
	});
	var team4 = new Team({
		name: "Dallas Stars",
		roster: [player25._id, player26._id, player27._id, player28._id, player29._id, player30._id, player31._id, player32._id],
		w: 0,
		otw: 0,
		otl: 0,
		l: 0
	});
	var team5 = new Team({
		name: "Los Angeles Kings",
		roster: [player33._id, player34._id, player35._id, player36._id, player37._id, player38._id, player39._id, player40._id],
		w: 0,
		otw: 0,
		otl: 0,
		l: 0
	});
	var team6 = new Team({
		name: "New Jersey Devils",
		roster: [player41._id, player42._id, player43._id, player44._id, player45._id, player46._id, player47._id, player48._id],
		w: 0,
		otw: 0,
		otl: 0,
		l: 0
	});

	player1.save(function(err, player) {
		player2.save(function(err, player) {
			player3.save(function(err, player) {
				player4.save(function(err, player) {
					player5.save(function(err, player) {
						player6.save(function(err, player) {
							player7.save(function(err, player) {
								player8.save(function(err, player) {
									player9.save(function(err, player) {
										player10.save(function(err, player) {
											player11.save(function(err, player) {
												player12.save(function(err, player) {
													player13.save(function(err, player) {
														player14.save(function(err, player) {
															player15.save(function(err, player) {
																player16.save(function(err, player) {
																	player17.save(function(err, player) {
																		player18.save(function(err, player) {
																			player19.save(function(err, player) {
																				player20.save(function(err, player) {
																					player21.save(function(err, player) {
																						player22.save(function(err, player) {
																							player23.save(function(err, player) {
																								player24.save(function(err, player) {
																									player25.save(function(err, player) {
																										player26.save(function(err, player) {
																											player27.save(function(err, player) {
																												player28.save(function(err, player) {
																													player29.save(function(err, player) {
																														player30.save(function(err, player) {
																															player31.save(function(err, player) {
																																player32.save(function(err, player) {
																																	player33.save(function(err, player) {
																																		player34.save(function(err, player) {
																																			player35.save(function(err, player) {
																																				player36.save(function(err, player) {
																																					player37.save(function(err, player) {
																																						player38.save(function(err, player) {
																																							player39.save(function(err, player) {
																																								player40.save(function(err, player) {
																																									player41.save(function(err, player) {
																																										player42.save(function(err, player) {
																																											player43.save(function(err, player) {
																																												player44.save(function(err, player) {
																																													player45.save(function(err, player) {
																																														player46.save(function(err, player) {
																																															player47.save(function(err, player) {
																																																player48.save(function(err, player) {
																																																	team1.save(function(err, team) {
																																																		team2.save(function(err, team) {
																																																			team3.save(function(err, team) {
																																																				team4.save(function(err, team) {
																																																					team5.save(function(err, team) {
																																																						team6.save(function(err, team) {

																																																						});
																																																					});
																																																				});
																																																			});
																																																		});
																																																	});
																																																});
																																															});
																																														});
																																													});
																																												});
																																											});
																																										});
																																									});
																																								});
																																							});
																																						});
																																					});
																																				});
																																			});
																																		});
																																	});
																																});
																															});
																														});
																													});
																												});
																											});
																										});
																									});
																								});
																							});
																						});
																					});
																				});
																			});
																		});
																	});
																});
															});
														});
													});
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});

	// End Mongoose Setup

	// Routes
	self.routes = {};

	// Root
	self.routes['root'] = function(req, res) {
		var session;
		if (req.session && req.session.account) {
			session = req.session.account.username;
		}
		res.render('home', {
			title: "Home",
			session: session
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
		var session;
		if (req.session && req.session.account) {
			session = req.session.account.username;
		}
		var games = Game.find({}).populate('blue', 'name').populate('red', 'name').exec(function(err, games) {
			console.log(games);
			if (!games) games = [];
			res.render('games', {
				title: "Games",
				session: session,
				games: games
			});
		});
	};

	// Players display page
	self.routes['players'] = function(req, res) {
		var session;
		if (req.session && req.session.account) {
			session = req.session.account.username;
		}
		Player.find({}, function(err, players) {
			if (!players) players = [];
			res.render('players', {
				title: "Players",
				session: session,
				players: players
			});
		});
	};

	// Teams display page
	self.routes['teams'] = function(req, res) {
		var session;
		if (req.session && req.session.account) {
			session = req.session.account.username;
		}
		Team.find({}).populate('roster', 'name').exec(function(err, teams) {
			if (!teams) teams = [];
			res.render('teams', {
				title: "Teams",
				session: session,
				teams: teams
			});
		});
	};

	// Goals display page
	self.routes['goals'] = function(req, res) {
		var session;
		if (req.session && req.session.account) {
			session = req.session.account.username;
		}
		Goal.find({}, function(err, goals) {
			if (!goals) goals = [];
			res.render('goals', {
				title: "Goals",
				session: session,
				goals: goals
			});
		});
	};

	// Goal submit (via stats extractor)
	self.routes['try-submit-goals'] = function(req, res) {
		res.send(".");
	};

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
	self.app.post('/try-login', self.routes['try-login']);
	self.app.get('/dashboard', self.routes['dashboard']);
	self.app.get('/try-logout', self.routes['try-logout']);
	self.app.get('/try-submit-goals', self.routes['try-submit-goals']);
	self.app.get('/goals', self.routes['goals']);
	self.app.get('/players', self.routes['players']);
	self.app.get('/teams', self.routes['teams']);
	self.app.get('/games', self.routes['games']);

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