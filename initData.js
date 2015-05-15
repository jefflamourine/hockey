#!/bin/env node

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';
var mongoPort = parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT) || 27017;
var mongoDbName = process.env.OPENSHIFT_APP_NAME || 'hockey'
var dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'user';
var dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'pass';

var Schema = mongoose.Schema;

var mongoConnectionString = "mongodb://" + dbUser + ":" + dbPass + "@" + mongoHost + ":" + mongoPort + "/" + mongoDbName;
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

var blankPlayer = new Player({
	name: "",
	active: false,
	gamesPlayed: -1,
	goals: -1,
	assists: -1
});
var player1 = new Player({
	name: "Burnwurnum",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player2 = new Player({
	name: "BigV",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player3 = new Player({
	name: "CrabInATree",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player4 = new Player({
	name: "Bojarzin",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player5 = new Player({
	name: "Nina",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player6 = new Player({
	name: "JLalu",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player7 = new Player({
	name: "DvD",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player8 = new Player({
	name: "meatsale",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player9 = new Player({
	name: "Zam",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player10 = new Player({
	name: "Dyaloreax",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player11 = new Player({
	name: "Hesse",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player12 = new Player({
	name: "pkpaching",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player13 = new Player({
	name: "Pet the Pizza",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player14 = new Player({
	name: "Superhotglue",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player15 = new Player({
	name: "Doucet",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player16 = new Player({
	name: "STAEDTLERS",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player17 = new Player({
	name: "Fuzzywuzzy",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player18 = new Player({
	name: "TaZeR",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player19 = new Player({
	name: "NotLead",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player20 = new Player({
	name: "Proper Cheeze",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player21 = new Player({
	name: "Jarvan",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player22 = new Player({
	name: "Kuzy",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player23 = new Player({
	name: "DrSlugger",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player24 = new Player({
	name: "DrGherms",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player25 = new Player({
	name: "Dalfan",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player26 = new Player({
	name: "Teemu Salami",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player27 = new Player({
	name: "Dick_Doug",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player28 = new Player({
	name: "Ticklebox",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player29 = new Player({
	name: "Dildozer",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player30 = new Player({
	name: "MCJabba69",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player31 = new Player({
	name: "5 lim",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player32 = new Player({
	name: "Trevkro",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player33 = new Player({
	name: "Gretzky",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player34 = new Player({
	name: "KS Otto",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player35 = new Player({
	name: "Sammy",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player36 = new Player({
	name: "Goose",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player37 = new Player({
	name: "Tluers",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player38 = new Player({
	name: "Quoof",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player39 = new Player({
	name: "Austin",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player40 = new Player({
	name: "SelfPlug",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player41 = new Player({
	name: "Gabe",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player42 = new Player({
	name: "kBomb",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player43 = new Player({
	name: "GoLeafsGo",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player44 = new Player({
	name: "Kapanen",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player45 = new Player({
	name: "Tallmidget",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player46 = new Player({
	name: "Jake Allen",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player47 = new Player({
	name: "NobodyEpic123",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});
var player48 = new Player({
	name: "Johnny Hockey",
	active: true,
	gamesPlayed: 0,
	goals: 0,
	assists: 0
});

players = [blankPlayer, player1, player2, player3, player4, player5, player6, player7, player8, player9, player10, player11, player12, player13, player14, player15, player16, player17, player18, player19, player20, player21, player22, player23, player24, player25, player26, player27, player28, player29, player30, player31, player32, player33, player34, player35, player36, player37, player38, player39, player40, player41, player42, player43, player44, player45, player46, player47, player48];

var WPG = new Team({
	name: "Winnipeg Jets",
	abbr: "WPG",
	roster: [player1._id, player2._id, player3._id, player4._id, player5._id, player6._id, player7._id, player8._id],
	w: 0,
	otw: 0,
	otl: 0,
	l: 0
});
var PHI = new Team({
	name: "Philadelphia Flyers",
	abbr: "PHI",
	roster: [player9._id, player10._id, player11._id, player12._id, player13._id, player14._id, player15._id, player16._id],
	w: 0,
	otw: 0,
	otl: 0,
	l: 0
});
var ATL = new Team({
	name: "Atlanta Thrashers",
	abbr: "ATL",
	roster: [player17._id, player18._id, player19._id, player20._id, player21._id, player22._id, player23._id, player24._id],
	w: 0,
	otw: 0,
	otl: 0,
	l: 0
});
var DAL = new Team({
	name: "Dallas Stars",
	abbr: "DAL",
	roster: [player25._id, player26._id, player27._id, player28._id, player29._id, player30._id, player31._id, player32._id],
	w: 0,
	otw: 0,
	otl: 0,
	l: 0
});
var LAK = new Team({
	name: "Los Angeles Kings",
	abbr: "LAK",
	roster: [player33._id, player34._id, player35._id, player36._id, player37._id, player38._id, player39._id, player40._id],
	w: 0,
	otw: 0,
	otl: 0,
	l: 0
});
var NJD = new Team({
	name: "New Jersey Devils",
	abbr: "NJD",
	roster: [player41._id, player42._id, player43._id, player44._id, player45._id, player46._id, player47._id, player48._id],
	w: 0,
	otw: 0,
	otl: 0,
	l: 0
});

teams = [WPG, PHI, ATL, DAL, LAK, NJD];

game1 = new Game({
	date: new Date(2015, 4, 17, 19, 30),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game2 = new Game({
	date: new Date(2015, 4, 17, 19, 50),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game3 = new Game({
	date: new Date(2015, 4, 17, 20, 10),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game4 = new Game({
	date: new Date(2015, 4, 19, 19, 30),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game5 = new Game({
	date: new Date(2015, 4, 19, 19, 50),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game6 = new Game({
	date: new Date(2015, 4, 19, 20, 10),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game7 = new Game({
	date: new Date(2015, 4, 21, 19, 30),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game8 = new Game({
	date: new Date(2015, 4, 21, 19, 50),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game9 = new Game({
	date: new Date(2015, 4, 21, 20, 10),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game10 = new Game({
	date: new Date(2015, 4, 24, 19, 30),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game11 = new Game({
	date: new Date(2015, 4, 24, 19, 50),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game12 = new Game({
	date: new Date(2015, 4, 24, 20, 10),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game13 = new Game({
	date: new Date(2015, 4, 26, 19, 30),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game14 = new Game({
	date: new Date(2015, 4, 26, 19, 50),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game15 = new Game({
	date: new Date(2015, 4, 26, 20, 10),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game16 = new Game({
	date: new Date(2015, 4, 28, 19, 30),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game17 = new Game({
	date: new Date(2015, 4, 28, 19, 50),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game18 = new Game({
	date: new Date(2015, 4, 28, 20, 10),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game19 = new Game({
	date: new Date(2015, 4, 31, 19, 30),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game20 = new Game({
	date: new Date(2015, 4, 31, 19, 50),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game21 = new Game({
	date: new Date(2015, 4, 31, 20, 10),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game22 = new Game({
	date: new Date(2015, 5, 2, 19, 30),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game23 = new Game({
	date: new Date(2015, 5, 2, 19, 50),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game24 = new Game({
	date: new Date(2015, 5, 2, 20, 10),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game25 = new Game({
	date: new Date(2015, 5, 4, 19, 30),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game26 = new Game({
	date: new Date(2015, 5, 4, 19, 50),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game27 = new Game({
	date: new Date(2015, 5, 4, 20, 10),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game28 = new Game({
	date: new Date(2015, 5, 7, 19, 30),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game29 = new Game({
	date: new Date(2015, 5, 7, 19, 50),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game30 = new Game({
	date: new Date(2015, 5, 7, 20, 10),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game31 = new Game({
	date: new Date(2015, 5, 9, 19, 30),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game32 = new Game({
	date: new Date(2015, 5, 9, 19, 50),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game33 = new Game({
	date: new Date(2015, 5, 9, 20, 10),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game34 = new Game({
	date: new Date(2015, 5, 11, 19, 30),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game35 = new Game({
	date: new Date(2015, 5, 11, 19, 50),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game36 = new Game({
	date: new Date(2015, 5, 11, 20, 10),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game37 = new Game({
	date: new Date(2015, 5, 14, 19, 30),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game38 = new Game({
	date: new Date(2015, 5, 14, 19, 50),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game39 = new Game({
	date: new Date(2015, 5, 14, 20, 10),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game40 = new Game({
	date: new Date(2015, 5, 16, 19, 30),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game41 = new Game({
	date: new Date(2015, 5, 16, 19, 50),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game42 = new Game({
	date: new Date(2015, 5, 16, 20, 10),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game43 = new Game({
	date: new Date(2015, 5, 18, 19, 30),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game44 = new Game({
	date: new Date(2015, 5, 18, 19, 50),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game45 = new Game({
	date: new Date(2015, 5, 18, 20, 10),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game46 = new Game({
	date: new Date(2015, 5, 21, 19, 30),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game47 = new Game({
	date: new Date(2015, 5, 21, 19, 50),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game48 = new Game({
	date: new Date(2015, 5, 21, 20, 10),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game49 = new Game({
	date: new Date(2015, 5, 23, 19, 30),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game50 = new Game({
	date: new Date(2015, 5, 23, 19, 50),
	blue: PHI._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: LAK._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game51 = new Game({
	date: new Date(2015, 5, 23, 20, 10),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game52 = new Game({
	date: new Date(2015, 5, 25, 19, 30),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game53 = new Game({
	date: new Date(2015, 5, 25, 19, 50),
	blue: NJD._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: WPG._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game54 = new Game({
	date: new Date(2015, 5, 25, 20, 10),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game55 = new Game({
	date: new Date(2015, 5, 28, 19, 30),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game56 = new Game({
	date: new Date(2015, 5, 28, 19, 50),
	blue: DAL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: ATL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game57 = new Game({
	date: new Date(2015, 5, 28, 20, 10),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game58 = new Game({
	date: new Date(2015, 5, 30, 19, 30),
	blue: WPG._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: NJD._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game59 = new Game({
	date: new Date(2015, 5, 30, 19, 50),
	blue: LAK._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: DAL._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});
game60 = new Game({
	date: new Date(2015, 5, 30, 20, 10),
	blue: ATL._id,
	bluePlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	blueScore: -1,
	red: PHI._id,
	redPlayedGames: {
		forwards: [],
		defense: [],
		goalies: []
	},
	redScore: -1
});

games = [game1, game2, game3, game4, game5, game6, game7, game8, game9, game10, game11, game12, game13, game14, game15, game16, game17, game18, game19, game20, game21, game22, game23, game24, game25, game26, game27, game28, game29, game30, game31, game32, game33, game34, game35, game36, game37, game38, game39, game40, game41, game42, game43, game44, game45, game46, game47, game48, game49, game50, game51, game52, game53, game54, game55, game56, game57, game58, game59, game60];

function savePlayers(start, total) {
	players[start - 1].save(function(err, player) {
		if (start < total) {
			savePlayers(start + 1, total);
		} else {
			saveTeams(1, 6);
		}
	});
}

function saveTeams(start, total) {
	teams[start - 1].save(function(err, team) {
		if (start < total) {
			saveTeams(start + 1, total);
		} else {
			saveGames(1, 60);
		}
	})
}

function saveGames(start, total) {
	games[start - 1].save(function(err, games) {
		if (start < total) {
			saveGames(start + 1, total);
		} else {
			console.log("Done");
		}
	})
}

savePlayers(1, 48);