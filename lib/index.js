'use strict';

function Status() {
	var status = this,
		HTTPStatusCode = require('http-status-code'),
		camelcase = require('camelcase');

	function init() {
		var definitions = HTTPStatusCode.getProtocolDefinitions();

		Object.keys(definitions).forEach(function(key) {
			var name = camelcase(definitions[key].replace(/I'm/, 'I am').replace(/[^a-z\s]+/ig, ' ').toLowerCase());

			Object.defineProperty(status, name, {
				enumerable: true,
				value: function(reply, result, headers) {
					var body = {
							statusCode: +key
						},
						response;

					if (result)
						body[Math.floor(+key * 0.01) >= 4 ? 'error' : 'result'] = result;

					response = reply(body).code(+key).type('application/json');

					if (headers) {
						Object.keys(headers).forEach(function(header) {
							response.header(header, headers[header]);
						});
					}

					return response;
				}
			});
		});
	}

	init();
}

module.exports = new Status();
