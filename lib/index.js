'use strict';

function Status() {
	var status = this,
		HTTPStatusCode = require('http-status-code'),
		camelcase = require('camelcase'),
		submerge = require('submerge'),
		delegate = {},
		defaults = {
			'content-type': 'application/json'
		};

	function init() {
		var definitions = HTTPStatusCode.getProtocolDefinitions();

		Object.keys(definitions).forEach(function(key) {
			var name = camelcase(definitions[key].replace(/I'm/, 'I am').replace(/[^a-z\s]+/ig, ' ').toLowerCase());

			status[name] = create(+key, definitions[key]);
			status[name].displayName = definitions[key];
		});
	}

	function applyHeaders(headers, response) {
		Object.keys(headers).forEach(function(header) {
			response.header(header, headers[header]);
		});

		return response;
	}

	delegate.applicationJson = function applicationJson(result, code, message) {
		var body = {
				statusCode: code,
				result: result
			};

		if (Math.floor(code * 0.01) >= 4) {
			body.error = message;
			delete body.result;
		}

		return body;
	};

	function create(code, message) {
		return function(reply, result, headers) {
			var body, type;

			headers = submerge(headers || {}, defaults);
			type = camelcase(headers['content-type'].replace(/\//, ' '));
			body = type in delegate ? delegate[type].apply(status, [result, code, message]) : result;

			return applyHeaders(headers, reply(body).code(code));
		};
	}

	init();
}

module.exports = new Status();
