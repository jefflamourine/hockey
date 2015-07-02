var routes = require('./routes.js')

/*
Map URLS to functions in routes.js
 */

module.exports = function(self) {

	// Utility
	self.app.get('/health', routes['health']);
	self.app.get('/session', routes['session']);

	// Views
	self.app.get('/', routes['root']);
	self.app.get('/teams', routes['teams']);
	self.app.get('/games', routes['games']);
	self.app.get('/goals', routes['goals']);
	self.app.get('/players', routes['players']);

	// Sessions
	self.app.post('/try-register', routes['try-register']);
	self.app.post('/try-login', routes['try-login']);
	self.app.post('/try-logout', routes['try-logout']);

	// Queries
	self.app.post('/query-players', routes['query-players']);
	self.app.post('/query-games', routes['query-games']);

	// Stats Extractor
	self.app.post('/try-submit-goals', routes['try-submit-goals']);
	self.app.post('/verify-game', routes['verify-game']);

	// Any url not previously mapped -> 404
	self.app.get('*', function(req, res) {
		res.status(404).send('HTTP 404');
	});
}