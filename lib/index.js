'use strict';

const HTTPStatusCode = require('http-status-code'),
	camelcase = require('camelcase'),
	submerge = require('submerge');

let defaults = {
		'content-type': 'application/json'
	},

	delegates = {
		applicationJson: (result, code, message) => {
			let body = {
					statusCode: code,
					result: result
				};

			if (+(code + '')[0] >= 4) {
				body.error = message;
				delete body.result;
			}

			return body;
		}
	};

/**
 * add headers to the response
 *
 * @method applyHeaders
 * @param {Object} headers
 * @param {Object} response
 * @return {Object} response
 * @private
 */
function applyHeaders(headers, response) {
	Object.keys(headers).forEach(header => {
		response.header(header, headers[header]);
	});

	return response;
}

/**
 * the Status class
 *
 * @class Status
 * @constructor
 */
class Status {
	/**
	 * the constructor for the Status class
	 *
	 * @method constructor
	 * @return void
	 * @public
	 */
	constructor() {
		let status = this,
			definitions = HTTPStatusCode.getProtocolDefinitions();

		Object.keys(definitions).forEach(key => {
			let name = camelcase(definitions[key].replace(/I'm/, 'I am').replace(/[^a-z\s]+/ig, ' ').toLowerCase());

			status[name] = status.create(+key, definitions[key]);
			status[name].displayName = definitions[key];
		});
	}

	/**
	 * add/replace a delegation for response manipulation
	 *
	 * @method addDelegation
	 * @return void
	 * @public
	 */
	addDelegation(type, delegation) {
		if (typeof delegation === 'function') {
			delegates[type] = delegation;
		}
	}

	/**
	 * create a function based on the status code message
	 *
	 * @method create
	 * @param {Number} code
	 * @param {String} message
	 * @return {Function}
	 * @public
	 */
	create(code, message) {
		let status = this;

		return function(reply, result, headers) {
			let body, type;

			headers = submerge(headers || {}, defaults);
			type = camelcase(headers['content-type'].replace(/\//, ' '));
			body = type in delegates ? delegates[type].apply(status, [result, code, message]) : result;

			return applyHeaders(headers, reply(body).code(code));
		};
	}
}

module.exports = new Status();
