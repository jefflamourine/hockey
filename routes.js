/*
The functions that are mapped to URLs which handle http(s) requests and send responses
 */

var mongoose = require('mongoose');
var Account = require('./models/models').Account;
var Player = require('./models/models').Player;
var Team = require('./models/models').Team;
var Goal = require('./models/models').Goal;
var Game = require('./models/models').Game;

var pwhash = require('password-hash');
var fs = require('fs');
var async = require('async');

var dataDir = process.env.OPENSHIFT_DATA_DIR || __dirname + '/data/';
var submissionLog = dataDir + 'submissions.txt';

// Trim a player name up to the tag (First open paren)
function trimName(name) {
	var tagIndex = name.indexOf('(');
	if (tagIndex !== -1) {
		return name.substr(0, tagIndex).trim();
	} else {
		return name;
	}
}

// Write a game submission to file as a backup 
// To use when the submission is inevitably bad
function writeSubmissionToFile(body) {
	var date = new Date().toUTCString();
	fs.appendFile(submissionLog, date + ": " + JSON.stringify(body) + "\n", function(err) {
		if (err) {
			console.log(body);
			console.log(err);
		}
	});
}

routes = {};

// Root
routes['root'] = function(req, res) {
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
routes['health'] = function(req, res) {
	res.send('1');
};

// Session
routes['session'] = function(req, res) {
	if (req.session && req.session.account) {
		res.send(req.session.account.username);
	} else {
		res.send("No valid session");
	}
};

// Registration form submit
routes['try-register'] = function(req, res) {
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

// Login form submit
routes['try-login'] = function(req, res) {
	var username = req.body.data.username;
	var password = req.body.data.password;

	Account.findOne({
		username: username
	}, function(err, account) {
		if (account) {
			if (pwhash.verify(password, account.password)) {
				req.session.account = account;
			}
		}
		res.redirect('/');
	});
};

// Logout
routes['try-logout'] = function(req, res) {
	req.session.reset();
	res.redirect('/');
};


routes['query-games'] = function(req, res) {
	var query = req.body.query;
	var team = req.body.team;
	Game.find(query).populate('blue', 'abbr').populate('red', 'abbr').exec(function(err, games) {
		if (err) {
			res.send(err);
		} else {
			if (team !== "") {
				var teamGames = [];
				games.forEach(function(g, i, l) {
					if (g.red.abbr === team || g.blue.abbr === team) {
						teamGames.push(g);
					}
				});
				res.send(teamGames);
			} else {
				res.send(games);
			}
		}
	});
};

// Games display page
routes['games'] = function(req, res) {
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

// Player query interface accessed by views
routes['query-players'] = function(req, res) {
	var query = req.body.query;
	var sort = req.body.sort;
	Player.find(query).sort(sort).exec(function(err, players) {
		if (err) {
			res.send(err);
		} else {
			res.send(players);
		}
	});
};

// Players display page
routes['players'] = function(req, res) {
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
routes['teams'] = function(req, res) {
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
routes['goals'] = function(req, res) {
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

// Game verification (for stats extractor)
// Example POST body: {"red":"ATL", "blue":"LAK", "date":"Sun May 17 2015 19:30:00"}
// Error codes (sent in response) 0 - Unknown err, 1 - Success, 2 - Team not found, 3 - Game not found
// Used to validate if the stats extractor was started correctly.
routes['verify-game'] = function(req, res) {
	var red = req.body.red;
	var blue = req.body.blue;
	var date = req.body.date;

	async.parallel({
			red: function(cb) {
				Team.findOne({
					abbr: red
				}, cb);
			},
			blue: function(cb) {
				Team.findOne({
					abbr: blue
				}, cb);
			},
		},
		function(err, teams) {
			if (err) {
				console.log(err);
				res.send("0");
			} else if (!(teams.red && teams.blue)) {
				res.send("2");
			} else {
				Game.findOne({
					red: teams.red._id,
					blue: teams.blue._id,
					date: date
				}, function(err, game) {
					if (err) {
						console.log(err);
						res.send("0");
					} else if (!game) {
						res.send("3");
					} else {
						res.send("1");
					}
				});
			}
		}
	);
};

// Goal submit (for stats extractor)
// Example POST body: {"red":"ATL", "blue":"LAK", "date":"Sun May 17 2015 19:30:00", "goals": [{"scorer": "Pet the Pizza", "assister": "Dyaloreax", "team":"blue", "period": 1}]}
routes['try-submit-goals'] = function(req, res) {
	writeSubmissionToFile(req.body);

	var redGoalCount = 0;
	var blueGoalCount = 0;
	var lastGoalPeriod = 0;

	// Main async wrapper to deal with all mongo queries.
	async.waterfall([
		// Query for the two teams in parallel
		function(callback) {
			async.parallel([
				// Red team
				function(cb) {
					Team.findOne({
						abbr: req.body.red
					}, cb);
				},
				// Blue team
				function(cb) {
					Team.findOne({
						abbr: req.body.blue
					}, cb);
				},
			], function(err, teams) {
				if (err) {
					callback(err);
				} else {
					teamsObj = {
						"red": teams[0],
						"blue": teams[1]
					};
					callback(null, teamsObj);
				}
			});
		},
		// Use the two teams (now that we have IDs), and date to find a game
		function(teams, callback) {
			Game.findOne({
				red: teams.red._id,
				blue: teams.blue._id,
				date: req.body.date
			}, function(err, game) {
				callback(err, teams, game)
			});
		},
		// The heavy lifting
		function(teams, game, callback) {
			// The period where the last goal was scored (to determine if OT occured)
			// Iterate over all the goals in the request and do lots of async operations
			async.forEach(req.body.goals, function(goal, cb) {
				var goalObj = {};
				var scorerName = trimName(goal.scorer);
				var assisterName = trimName(goal.assister);
				if (goal.period > lastGoalPeriod) {
					lastGoalPeriod = goal.period;
				}
				var teamFor;
				// Set teamFor to team who scored and count the goals
				if (goal.team == "red") {
					teamFor = teams.red;
					redGoalCount += 1;
				} else {
					teamFor = teams.blue;
					blueGoalCount += 1;
				}
				// Find scorer and assister in parallel
				async.parallel([
					function(pcb) {
						Player.findOne({
							name: scorerName
						}, pcb);
					},
					function(pcb) {
						Player.findOne({
							name: assisterName
						}, pcb);
					}
				], function(err, players) {
					// Update scorer, assister, goal
					if (!err) {
						players[0].goals += 1;
						goalObj.scorer = players[0]._id;
						players[1].assists += 1;
						goalObj.assister = players[1]._id;
						goalObj.team = teamFor._id;
						goalObj.game = game._id;
						goalObj.period = goal.period;
						goalDoc = new Goal(goalObj);
						// We're done with the goal and players, so save in parallel
						async.parallel([
							function(pcb) {
								goalDoc.save(pcb);
							},
							function(pcb) {
								players[0].save(pcb);
							},
							function(pcb) {
								players[1].save(pcb);
							}
						], function(err) {
							cb(err);
						});
					} else {
						cb(err);
					}
				})
			}, function(err) {
				callback(err, teams, game);
			});
		},
		function(teams, game, callback) {
			// Update the results of the game
			game.redScore = redGoalCount;
			game.blueScore = blueGoalCount;
			if (game.redScore > game.blueScore) {
				if (lastGoalPeriod < 3) {
					teams.red.w += 1;
					teams.blue.l += 1;
				} else {
					teams.red.otw += 1;
					teams.blue.otl += 1;
				}
			} else if (game.blueScore > game.redScore) {
				if (lastGoalPeriod < 3) {
					teams.red.w += 1;
					teams.blue.l += 1;
				} else {
					teams.red.otw += 1;
					teams.blue.otl += 1;
				}
			}
			// We're done with the game and teams, so save them in parallel
			async.parallel([
				function(scb) {
					teams.red.save(scb);
				},
				function(scb) {
					teams.blue.save(scb);
				},
				function(scb) {
					game.save(scb);
				}
			], function(err) {
				callback(err);
			});
		}
	], function(err) {
		res.send("OK");
	});
};

routes['consolidated'] = function(req, res) {
	var session;
	if (req.session && req.session.account) {
		session = req.session.account.username;
	}
	res.render('consolidated', {
		title: "Consolidated",
		session: session
	});
};



module.exports = routes;