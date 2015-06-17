var routes = require('./routes.js')

module.exports = function(self) {

	// URL Mappings
	self.app.get('/', routes['root']);
	self.app.get('/health', routes['health']);
	self.app.get('/session', routes['session']);
	self.app.post('/try-register', routes['try-register']);
	self.app.post('/try-login', routes['try-login']);
	self.app.get('/try-logout', routes['try-logout']);
	self.app.post('/try-submit-goals', routes['try-submit-goals']);
	self.app.get('/goals', routes['goals']);
	self.app.get('/players', routes['players']);
	self.app.post('/query-players', routes['query-players']);
	self.app.post('/query-games', routes['query-games']);
	self.app.get('/teams', routes['teams']);
	self.app.get('/games', routes['games']);

	// Any url not previously mapped -> 404
	self.app.get('*', function(req, res) {
		res.status(404).send('HTTP 404');
	});
}