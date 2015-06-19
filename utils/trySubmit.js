#!/bin/env node

var request = require('request');

var host = 'http://localhost:8080';

function trySubmitGame() {
	request.post(
		host + '/try-submit-goals', {
			form: {
				"red": "ATL",
				"blue": "LAK",
				"date": "Sun May 17 2015 19:30:00",
				"goals": [{
					"scorer": "Pet the Pizza",
					"assister": "Dyaloreax",
					"team": "red",
					"period": 1
				}, {
					"scorer": "Pet the Pizza",
					"assister": "Dyaloreax",
					"team": "red",
					"period": 1
				}]
			}
		},
		function(err, res, body) {
			if (err) {
				//console.log(err);
			} else {
				//console.log(res);
				//console.log(body);
			}
		}
	);
}

function tryVerifyGame() {
	request.post(
		host + '/verify-game', {
			form: {
				"red": "ATL",
				"blue": "LAK",
				"date": "Sun May 17 2015 19:30:00"
			}
		},
		function(err, res, body) {
			if (err) {
				console.log(err);
			} else {
				console.log(res);
				console.log(body);
			}
		}
	);
}

trySubmitGame();
//tryVerifyGame();