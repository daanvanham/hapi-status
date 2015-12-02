'use strict';

const HTTPStatusCode = require('http-status-code'),
	camelcase = require('camelcase'),
	submerge = require('submerge');

let defaults = {
		'content-type': 'application/json'
	},

	delegate = {
		applicationJson: (result, code, message) => {
			let body = {
					statusCode: code,
					result: result
				};

			if (Math.floor(code * 0.01) >= 4) {
				body.error = message;
				delete body.result;
			}

			return body;
		}
	};

function applyHeaders(headers, response) {
	Object.keys(headers).forEach(header => {
		response.header(header, headers[header]);
	});

	return response;
}

class Status {
	constructor() {
		let status = this,
			definitions = HTTPStatusCode.getProtocolDefinitions();

		Object.keys(definitions).forEach(key => {
			let name = camelcase(definitions[key].replace(/I'm/, 'I am').replace(/[^a-z\s]+/ig, ' ').toLowerCase());

			status[name] = status.create(+key, definitions[key]);
			status[name].displayName = definitions[key];
		});
	}

	create(code, message) {
		let status = this;

		return function(reply, result, headers) {
			let body, type;

			headers = submerge(headers || {}, defaults);
			type = camelcase(headers['content-type'].replace(/\//, ' '));
			body = type in delegate ? delegate[type].apply(status, [result, code, message]) : result;

			return applyHeaders(headers, reply(body).code(code));
		};
	}
}

module.exports = new Status();
