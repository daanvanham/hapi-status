'use strict';

var Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	Code = require('code'),
	HTTPStatusCode = require('http-status-code'),
	status = require('../index');

function Reply() {
	var reply = this;

	reply.headers = {};

	reply.code = function code(status) {
		reply.statusCode = status;
		return reply;
	};

	reply.type = function type(contentType) {
		reply.header('Content-Type', contentType);

		return reply;
	};

	reply.header = function(key, value) {
		reply.headers[key] = value;

		return reply;
	};

	return function body(result) {
		reply.result = result;

		return reply;
	};
}

Object.keys(status).forEach(function(key) {
	lab.experiment(key, function() {
		lab.test('should serve the right statusCode', function(done) {
			var response = status[key].apply(null, [new Reply(), 'test']);

			Code.expect(response.result.statusCode).to.equal(response.statusCode);

			done();
		});

		lab.test('should contain the right key', function(done) {
			var response = status[key].apply(null, [new Reply(), 'test']).result;

			if (Math.floor(response.statusCode * 0.01) >= 4) {
				Code.expect('error' in response).to.equal(true);
				Code.expect('result' in response).to.equal(false);
			}
			else {
				Code.expect('error' in response).to.equal(false);
				Code.expect('result' in response).to.equal(true);
			}

			done();
		});

		lab.test('should return only statusCode when no result present', function(done) {
			var response = status[key].apply(null, [new Reply()]).result;

			Code.expect(!('error' in response) && !('result' in response)).to.equal(true);

			done();
		});

		lab.test('should be able to add headers', function(done) {
			var response = status[key].apply(null, [new Reply(), 'test', {'Cache-Control': 'max-age=0, no-cache, no-store'}]);

			Code.expect('Cache-Control' in response.headers).to.equal(true);
			Code.expect(response.headers['Cache-Control']).to.equal('max-age=0, no-cache, no-store');

			done();
		});
	});
});
