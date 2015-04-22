#!/bin/env node

var express = require('express');
var mongodb = require('mongodb');
var pwhash = require('password-hash');
var session = require('client-sessions');
var Q = require('q');

var App = function(){

	// Scope
	var self = this;

	// Set up constants
	self.ipaddr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
	self.port	= parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;
	self.mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1';
	self.mongoPort = parseInt(process.env.OPENSHIFT_MONGODB_DB_PORT) || 27017;
	self.mongoDbName = process.env.OPENSHIFT_APP_NAME || 'hockey'
	self.dbUser = process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'user';
	self.dbPass = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'pass'

	// Mongo intialization
	self.dbServer = new mongodb.Server(self.mongoHost, self.mongoPort);
	self.db = new mongodb.Db(self.mongoDbName, self.dbServer, {auto_reconnect: true});
	self.accountCollection = self.db.collection('account');

	// Routes
	self.routes = {};
	self.routes['health'] = function(req, res){ res.send('1'); };
	self.routes['session'] = function(req, res) {
		if (req.session && req.session.account) {
			res.send(req.session.account.username);
		} else {
			res.send("No valid session");
		}
	};
	self.routes['root'] = function(req, res) { res.render('index.html'); };

	// Registration form & form post
	self.routes['register'] = function(req, res) { res.render('register.html'); };
	self.routes['try-register'] = function(req, res) {
		var name = req.body.data.name;
		var password = req.body.data.password;

		self.registerAccount(name, password).then(self.sendRegisterResult(req, res));
	};

	// Login form & form post
	self.routes['login'] = function(req, res) { res.render('login.html'); };
	self.routes['try-login'] = function(req, res) {
		var name = req.body.data.name;
		var password = req.body.data.password;

		self.accountCollection.findOne( {"username": name}, function(err, account) {
			if (account) {
				if (pwhash.verify(password, account.password)) {
					req.session.account = account;
					res.send( "Logged in as: " + account.username );
				} else {
					res.redirect('/');
				}
			} else {
				res.redirect('/');
			}
		});
	};

	// Create app
	self.app = express();

	// Serve static html from /public
	self.app.use(express.static(__dirname + '/public'));

	var bodyParser = require('body-parser');

	self.app.use( bodyParser.json() );		// to support JSON-encoded bodies
	self.app.use(bodyParser.urlencoded({	// to support URL-encoded bodies
		extended: true
	})); 

	self.app.use(session({
		cookieName: 'session',
		secret: 'random_string_goes_here',
		duration: 30 * 60 * 1000,
		activeDuration: 5 * 60 * 1000,
	}));

	// URL Mappings
	self.app.get ('/health', 		self.routes['health']);
	self.app.get ('/session',		self.routes['session']);
	self.app.get ('/', 				self.routes['root']);
	self.app.get ('/register', 		self.routes['register']);
	self.app.post('/try-register', 	self.routes['try-register']);
	self.app.get ('/login', 		self.routes['login']);
	self.app.post('/try-login', 	self.routes['try-login']);
	self.app.get ('*', function(req, res) {
		res.status(404).send('HTTP 404');
	});

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

	// Check if name exists, if it doesn't, insert new account
	// Since the Node MongoDB driver is async, use Q.defer() and return promise
	self.registerAccount = function(name, password) {
		var deferred = Q.defer();

		self.accountCollection.findOne( {"username": name}, function(err, account) {
			if (account) {
				deferred.resolve(false);
			} else {
				self.insertAccount(name, password);
				deferred.resolve(true);
			}
		});

		return deferred.promise;
	}

	// Insert account with given details and no permissions
	self.insertAccount = function(name, password) {
		var hashedPassword = pwhash.generate(password);
		var account = {"username": name, "password": hashedPassword, "permissions": [] };

		self.accountCollection.insert(account);
	}

	// Curry send register result to use given req/res pair and take a success boolean
	self.sendRegisterResult = function(req, res) {
		return function(successful) {
			if (successful) {
				res.send("Successful");
			} else {
				res.send("Unsuccessful");
			}
		}
	}
};

// Make a new express app
var app = new App();

// Connect to Mongo DB with start server callback
app.connectDb(app.startServer);

