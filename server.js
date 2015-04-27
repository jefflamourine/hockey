#!/bin/env node

var express = require('express');
var mongodb = require('mongodb');
var pwhash = require('password-hash');
var session = require('client-sessions');
var Q = require('q');

function createAccount(name, password) {
	var hashedPassword = pwhash.generate(password);
	return {"username": name, "password": hashedPassword, "permissions": [] };
}

var App = function(){

	// Scope
	var self = this;

	// Set up constants
	self.ipaddr 		= process.env.OPENSHIFT_NODEJS_IP 					|| '127.0.0.1';
	self.port			= parseInt(process.env.OPENSHIFT_NODEJS_PORT) 		|| 8080;
	self.mongoHost 		= process.env.OPENSHIFT_MONGODB_DB_HOST 			|| '127.0.0.1';
	self.mongoPort 		= parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT) 	|| 27017;
	self.mongoDbName 	= process.env.OPENSHIFT_APP_NAME 					|| 'hockey'
	self.dbUser 		= process.env.OPENSHIFT_MONGODB_DB_USERNAME 		|| 'user';
	self.dbPass 		= process.env.OPENSHIFT_MONGODB_DB_PASSWORD 		|| 'pass'

	// Mongo intialization
	self.dbServer = new mongodb.Server(self.mongoHost, self.mongoPort);
	self.db = new mongodb.Db(self.mongoDbName, self.dbServer, {auto_reconnect: true});
	self.accountCollection = self.db.collection('account');
	self.goalCollection = self.db.collection('goal');
	self.playerCollection = self.db.collection('player');
	self.teamCollection = self.db.collection('team');

	// Routes
	self.routes = {};

	// Root
	self.routes['root'] = function(req, res){
		res.render('index', {title: 'Home'});
	};

	// Health
	self.routes['health'] = function(req, res){ res.send('1'); };

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
		res.render('register', {title: 'Register'});
	};

	// Registration form submit
	self.routes['try-register'] = function(req, res) {
		var name = req.body.name;
		var password = req.body.password;

		self.registerAccount(name, password).then(self.sendRegisterResult(req, res));
	};

	// Login form
	self.routes['login'] = function(req, res) {
		res.render('login', {title: 'Login'});
	};

	// Login form submit
	self.routes['try-login'] = function(req, res) {
		var name = req.body.data.name;
		var password = req.body.data.password;

		self.accountCollection.findOne( {"username": name}, function(err, account) {
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
			res.render('dashboard', {title: 'Dashboard', name: req.session.account.username});
		} else {
			res.redirect('/');
		}
	};

	// Logout
	self.routes['try-logout'] = function(req, res) {
		req.session.reset();
		res.redirect('/');
	};

	// Players display page
	self.routes['players'] = function(req, res) {
		self.queryCollection(self.playerCollection, {}).then(function(players) {
			res.render('players', {title: "Players", players: players});
		});
	};

	// Teams display page
	self.routes['teams'] = function(req, res) {
		self.queryCollection(self.teamCollection, {}).then(function(teams) {
			res.render('teams', {title: "Teams", teams: teams});
		});
	};

	// Goals display page
	self.routes['goals'] = function(req, res) {
		self.queryCollection(self.goalCollection, {}).then(function(goals) {
			res.render('goals', {title: "Goals", goals: goals} );
		});
	};

	// Goal submission form
	self.routes['submit-goals'] = function(req, res) {
		res.render('submit-goals', {title: 'Submit Goals'});
	};

	// Goal submit
	self.routes['try-submit-goals'] = function(req, res) {
		var scorer = req.body.data.scorer;
		var assister = req.body.data.assister;
		var game = req.body.data.game;

		var goal = {scorer: scorer, assister: assister, game: game};

		self.goalCollection.insert(goal);

		res.redirect('/goals');
	};

	// Create app
	self.app = express();

	// Serve static files from /public
	self.app.use(express.static(__dirname + '/public'));

	// Set up app to use jade
	self.app.set('views', __dirname + '/views')
	self.app.set('view engine', 'jade')

	var bodyParser = require('body-parser');

	self.app.use( bodyParser.json() );		// to support JSON-encoded bodies
	self.app.use(bodyParser.urlencoded({	// to support URL-encoded bodies
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
	self.app.get ('/',					self.routes['root']);
	self.app.get ('/health', 			self.routes['health']);
	self.app.get ('/session',			self.routes['session']);
	self.app.get ('/register',			self.routes['register']);
	self.app.post('/try-register', 		self.routes['try-register']);
	self.app.get ('/login',				self.routes['login']);
	self.app.get ('/dashboard',			self.routes['dashboard']);
	self.app.post('/try-login', 		self.routes['try-login']);
	self.app.get ('/try-logout',		self.routes['try-logout']);
	self.app.get ('/submit-goals',		self.routes['submit-goals']);
	self.app.post('/try-submit-goals',	self.routes['try-submit-goals']);
	self.app.get ('/goals',				self.routes['goals']);
	self.app.get ('/players',			self.routes['players']);
	self.app.get ('/teams',				self.routes['teams']);

	// Any url not previously mapped -> 404
	self.app.get ('*', function(req, res) {
		res.status(404).send('HTTP 404');
	});

	// Check if name exists, if it doesn't, insert new account
	// Since the Node MongoDB driver is async, use Q.defer() and return promise
	self.registerAccount = function(name, password) {
		var deferred = Q.defer();

		self.accountCollection.findOne( {"username": name}, function(err, account) {
			if (account || password === "") {
				deferred.resolve(false);
			} else {
				var account = createAccount(name, password);
				self.accountCollection.insert(account);
				deferred.resolve(true);
			}
		});

		return deferred.promise;
	};

	// Curry send register result to use given req/res pair and take a success boolean
	self.sendRegisterResult = function(req, res) {
		return function(successful) {
			if (successful) {
				res.send("Successful");
			} else {
				res.send("Unsuccessful");
			}
		}
	};

	// Return the documents from the given collection
	// Matching the given query
	self.queryCollection = function(collection, query) {
		var deferred = Q.defer();

		var cursor = collection.find(query);
		cursor.toArray(function(err, docs) {
			deferred.resolve(docs);
		});
		return deferred.promise;
	};

	// Return the first document in the given collection
	// Matching the given query
	self.findOne = function(collection, query) {
		var deferred = Q.defer();

		collection.findOne(query, function(err, doc) {
			deferred.resolve(doc);
		});
		return deferred.promise;
	};

	// ----- Starting and stopping the server -----

	// Logic to open a database connection.
	self.connectDb = function(callback){
		self.db.open(function(err, db){
			if(err){ throw err };
			self.db.authenticate(self.dbUser, self.dbPass, {authdb: "admin"}, function(err, res){
			if(err){ throw err };
			callback();
			});
		});
	};
	
	// Starting the Node JS server with Express
	self.startServer = function(){
		self.app.listen(self.port, self.ipaddr, function(){
			console.log('%s: Node server started on %s:%d ...', Date(Date.now()), self.ipaddr, self.port);
		});
	}

	// Destructors
	self.terminator = function(sig) {
		if (typeof sig === "string") {
			console.log('%s: Received %s - terminating Node server ...', Date(Date.now()), sig);
			process.exit(1);
		};
		console.log('%s: Node server stopped.', Date(Date.now()) );
	};

	process.on('exit', function() { self.terminator(); });

	self.terminatorSetup = function(element, index, array) {
		process.on(element, function() { self.terminator(element); });
	};

	['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'].forEach(self.terminatorSetup);

};

// Make a new express app
var app = new App();

// Connect to Mongo DB with start server callback
app.connectDb(app.startServer);

