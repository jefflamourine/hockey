var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

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
	},
	time: {
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
	blueScore: {
		type: Number,
		required: true
	},
	red: {
		type: Schema.ObjectId,
		ref: 'Team',
		required: true
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

module.exports.Account = Account;
module.exports.Player = Player;
module.exports.Team = Team;
module.exports.Goal = Goal;
module.exports.Game = Game;
