#!/bin/env node

var express = require('express');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var pwhash = require('password-hash');
var session = require('client-sessions');
var Q = require('q');
var fs = require('fs');

function trimName(name) {
	var tagIndex = name.indexOf('(');
	if (tagIndex !== -1) {
		return name.substr(0, tagIndex).trim();
	} else {
		return name;
	}
}

var App = function() {

	// Scope
	var self = this;

	// Set up constants
	self.dataDir = process.env.OPENSHIFT_DATA_DIR || __dirname + '/data/';
	self.submissionLog = self.dataDir + 'submissions.txt';

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
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		permissions: [String]
	});

	accountSchema.plugin(uniqueValidator);

	var playerSchema = new Schema({
		name: {
			type: String,
			unique: true
		},
		active: {
			type: Boolean,
			required: true,
		},
		gamesPlayed: {
			type: Number,
			required: true,
		},
		goals: {
			type: Number,
			required: true,
		},
		assists: {
			type: Number,
			required: true
		}
	});

	playerSchema.plugin(uniqueValidator);

	var teamSchema = new Schema({
		name: {
			type: String,
			unique: true,
			required: true
		},
		abbr: {
			type: String,
			unique: true,
			required: true
		},
		roster: {
			type: [{
				type: Schema.Types.ObjectId,
				ref: 'Player'
			}],
			required: true
		},
		w: {
			type: Number,
			required: true
		},
		otw: {
			type: Number,
			required: true
		},
		otl: {
			type: Number,
			required: true
		},
		l: {
			type: Number,
			required: true
		},
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
			ref: 'Game',
			required: true
		},
		team: {
			type: Schema.Types.ObjectId,
			ref: 'Team',
			required: true
		},
		period: {
			type: Number,
			required: true
		}
	});

	var gameSchema = new Schema({
		date: {
			type: Date,
			required: true
		},
		blue: {
			type: Schema.ObjectId,
			ref: 'Team',
			required: true
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
		blueScore: {
			type: Number,
			required: true
		},
		red: {
			type: Schema.ObjectId,
			ref: 'Team',
			required: true
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
		redScore: {
			type: Number,
			required: true
		}
	});

	var Account = mongoose.model('Account', accountSchema);
	var Player = mongoose.model('Player', playerSchema);
	var Team = mongoose.model('Team', teamSchema);
	var Goal = mongoose.model('Goal', goalSchema);
	var Game = mongoose.model('Game', gameSchema);

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

	self.routes['new-layout'] = function(req, res) {
		var session;
		if (req.session && req.session.account) {
			session = req.session.account.username;
		}
		res.render('new-layout', {
			title: "Home",
			session: session
		});
	}

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
		var games = Game.find({}).populate('blue', 'abbr').populate('red', 'abbr').exec(function(err, games) {
			if (!games) games = [];
			res.render('games', {
				title: "Games",
				session: session,
				games: games
			});
		});
	};

	self.routes['query-players'] = function(req, res) {
		var query = req.body.query;
		var sort = req.body.sort;
		Player.find(query).sort(sort).exec(function(err, players) {
			if (err) {
				res.send(err);
			} else {
				res.send(players);
			}
		});
	}

	// Players display page
	self.routes['players'] = function(req, res) {
		var session;
		if (req.session && req.session.account) {
			session = req.session.account.username;
		}
		res.render('players', {
			title: "Players",
			session: session,
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
	// Example POST body: {"red": "ATL", "blue":"LAK", "date":"Sun May 17 2015 19:30:00", "goals": [{"scorer": "Pet the Pizza", "assister": "Dyaloreax", "team":"blue", "period": 1}]}
	// I should use promises... promises are hard.
	self.routes['try-submit-goals'] = function(req, res) {
		self.writeSubmissionToFile(req.body);
		console.log("Logged submission in case of errors");
		// Grab data from body
		var redTeamAbbr = req.body.red;
		var blueTeamAbbr = req.body.blue;
		var date = req.body.date;
		var goals = req.body.goals;
		var totalGoals = goals.length;
		var redGoalCount = 0;
		var blueGoalCount = 0;
		var processedGoals = 0;
		// Query for red team
		Team.findOne({
			abbr: redTeamAbbr
		}, function(err, redTeam) {
			if (err) {
				res.send(err);
			} else if (!redTeam) {
				res.send("Couldn't find red team");
			} else {
				// Then get blue team
				Team.findOne({
					abbr: blueTeamAbbr
				}, function(err, blueTeam) {
					if (err) {
						res.send(err);
					} else if (!blueTeam) {
						res.send("Couldn't find blue team");
					} else {
						// Query for the game
						Game.findOne({
							date: date,
							red: redTeam._id,
							blue: blueTeam._id
						}, function(err, game) {
							if (err) {
								res.send(err);
							} else if (!game) {
								res.send("Couldn't find game");
							} else {
								// For each goal
								goals.forEach(function(extractedGoal) {
									// Our new goal object
									var goal = {};
									var scorerName = trimName(extractedGoal.scorer);
									var assisterName = trimName(extractedGoal.assister);
									var period = extractedGoal.period;
									var teamFor;
									// Set teamFor to team who scored
									if (extractedGoal.team == "red") {
										teamFor = redTeam;
										redGoalCount += 1;
									} else {
										teamFor = blueTeam;
										blueGoalCount += 1;
									}
									// Find the scorer
									Player.findOne({
										name: scorerName
									}, function(err, scorer) {
										if (err) {
											res.send(err);
										} else if (!scorer) {
											res.send("Couldn't find scorer");
										} else {
											// Give them a goal and add to the new goal object, save
											scorer.goals += 1;
											goal.scorer = scorer._id;
											scorer.save(function(err) {
												// Find the assister
												Player.findOne({
													name: assisterName
												}, function(err, assister) {
													if (err) {
														res.send(err);
													} else if (!assister) {
														res.send("Couldn't find assister");
													} else {
														// Give them an assist and add to the new goal object, save
														assister.assists += 1;
														goal.assister = assister._id;
														assister.save(function(err) {
															if (err) {
																res.send(err);
															} else {
																// Set up the rest of the goal doc and save
																goal.team = teamFor._id;
																goal.game = game._id;
																goal.period = period;
																goalDoc = new Goal(goal);
																goalDoc.save(function(err) {
																	if (err) {
																		res.send(err);
																	} else {
																		processedGoals++;
																		// If the number of goals that have been processed equals
																		// the total number of goals in the request, save the game and respond.
																		if (processedGoals == totalGoals) {
																			game.redScore = redGoalCount;
																			game.blueScore = blueGoalCount;
																			if (game.redScore > game.blueScore) {
																				if (period < 3) {
																					redTeam.w += 1;
																					blueTeam.l += 1;
																				} else {
																					redTeam.otw += 1;
																					blueTeam.otl += 1;
																				}
																			} else if (game.blueScore > game.redScore) {
																				if (period < 3) {
																					blueTeam.w += 1;
																					redTeam.l += 1;
																				} else {
																					blueTeam.otw += 1;
																					redTeam.otl += 1;
																				}
																			}
																			redTeam.save(function(err) {
																				if (err) {
																					console.log(err);
																				}
																			});
																			blueTeam.save(function(err) {
																				if (err) {
																					console.log(err);
																				}
																			});
																			game.save(function(err) {
																				if (err) {
																					res.send(err);
																				} else {
																					res.send("Success");
																				}
																			});
																		}
																	}
																});
															}
														});
													}
												});
											});
										}
									});
								});
							}
						});
					}
				});
			}
		});
	};

	self.writeSubmissionToFile = function(body) {
		var date = new Date().toUTCString();
		fs.appendFile(self.submissionLog, date + ": " + JSON.stringify(body) + "\n", function(err) {
			if (err) {
				console.log(body);
				return console.log(err);
			}
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
	self.app.get('/new-layout', self.routes['new-layout']);
	self.app.get('/health', self.routes['health']);
	self.app.get('/session', self.routes['session']);
	self.app.get('/register', self.routes['register']);
	self.app.post('/try-register', self.routes['try-register']);
	self.app.get('/login', self.routes['login']);
	self.app.post('/try-login', self.routes['try-login']);
	self.app.get('/dashboard', self.routes['dashboard']);
	self.app.get('/try-logout', self.routes['try-logout']);
	self.app.post('/try-submit-goals', self.routes['try-submit-goals']);
	self.app.get('/goals', self.routes['goals']);
	self.app.get('/players', self.routes['players']);
	self.app.post('/query-players', self.routes['query-players']);
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