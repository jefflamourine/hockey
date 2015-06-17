var mongoose = require('mongoose');
var Account = require('./models/models').Account;
var Player = require('./models/models').Player;
var Team = require('./models/models').Team;
var Goal = require('./models/models').Goal;
var Game = require('./models/models').Game;

var pwhash = require('password-hash');

// Trim a player name up to the tag (First open parene)
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
			return console.log(err);
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
}

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
}

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

// Goal submit (via stats extractor)
// Example POST body: {"red": "ATL", "blue":"LAK", "date":"Sun May 17 2015 19:30:00", "goals": [{"scorer": "Pet the Pizza", "assister": "Dyaloreax", "team":"blue", "period": 1}]}
// I should use promises... promises are hard.
routes['try-submit-goals'] = function(req, res) {
	writeSubmissionToFile(req.body);
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

module.exports = routes;
