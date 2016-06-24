'use strict';

const Lab = require('lab'),
	lab = exports.lab = Lab.script(),
	Code = require('code'),
	status = require('../lib');

function Reply() {
	let reply = this;

	reply.headers = {};

	reply.code = (statusCode) => {
		reply.statusCode = statusCode;
		return reply;
	};

	reply.type = (contentType) => {
		reply.header('Content-Type', contentType);

		return reply;
	};

	reply.header = (key, value) => {
		reply.headers[key] = value;

		return reply;
	};

	return (result) => {
		reply.result = result;

		return reply;
	};
}

Object.keys(status).forEach((key) => {
	lab.experiment(key, () => {
		lab.test('should serve the right statusCode', (done) => {
			let response = status[key].apply(null, [new Reply()]);

			Code.expect(response.result.statusCode).to.equal(response.statusCode);

			done();
		});

		lab.test('should contain the right key', (done) => {
			let response = status[key].apply(null, [new Reply(), 'test']).result;

			if (+(response.statusCode + '')[0] >= 4) {
				Code.expect('error' in response).to.equal(true);
				Code.expect('result' in response).to.equal(false);
			}
			else {
				Code.expect('error' in response).to.equal(false);
				Code.expect('result' in response).to.equal(true);
			}

			done();
		});

		lab.test('should be able to add headers', (done) => {
			let response = status[key].apply(null, [new Reply(), 'test', {'Cache-Control': 'max-age=0, no-cache, no-store'}]);

			Code.expect('Cache-Control' in response.headers).to.equal(true);
			Code.expect(response.headers['Cache-Control']).to.equal('max-age=0, no-cache, no-store');

			done();
		});

		lab.test('should serve the right content type', (done) => {
			let response = status[key].apply(null, [new Reply(), '<h1>Test</h1>', {'content-type': 'text/html'}]);

			Code.expect(response.headers['content-type']).to.equal('text/html');
			Code.expect(response.result).to.equal('<h1>Test</h1>');

			done();
		});
	});
});

lab.experiment('add a new delegation', () => {
	lab.test('should be skipped if it\'s not a function', (done) => {
		let response;

		status.addDelegation('textHtml', 'some-text');

		response = status.ok.apply(null, [new Reply(), 'Test', {'content-type': 'text/html'}]);

		Code.expect(response.result).to.equal('Test');

		done();
	});

	lab.test('should be able to alter the response.result', (done) => {
		let response;

		status.addDelegation('textHtml', () => 'Hi!');

		response = status.ok.apply(null, [new Reply(), 'Test', {'content-type': 'text/html'}]);

		Code.expect(response.result).to.equal('Hi!');

		done();
	});

	lab.test('should be able to alter an existing delegate', (done) => {
		let response;

		response = status.ok.apply(null, [new Reply(), ['Test']]);

		Code.expect(response.result).to.be.an.object();
		Code.expect(response.result.statusCode).to.be.a.number();
		Code.expect(response.result.result).to.be.an.array();

		status.addDelegation('applicationJson', (result)  => result);

		response = status.ok.apply(null, [new Reply(), ['Test']]);

		Code.expect(response.result).to.be.an.array();

		done();
	});
});
