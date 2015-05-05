[![npm version](https://badge.fury.io/js/hapi-status.svg)](http://badge.fury.io/js/hapi-status)
[![travis ci](https://api.travis-ci.org/daanvanham/hapi-status.svg)](https://travis-ci.org/daanvanham/hapi-status)
[![Coverage Status](https://coveralls.io/repos/daanvanham/hapi-status/badge.svg)](https://coveralls.io/r/daanvanham/hapi-status)

# Hapi Status
Easily reply to your request with a statusCode and optional headers

## Install
```
npm install hapi-status --save
```

## Usage
```
var status = require('hapi-status');

// ...

server.route({
	method: 'GET',
	path: '/'
	handler: function(request, reply) {
		var result = 'whatever you want to give back to the client';

		return status.ok(reply, result);
	}
});

// ...
```

## Available methods

### 1xx - Informational
- continue
- switchingProtocols
- processing

### 2xx - Successful
- ok
- created
- accepted
- nonAuthoritativeInformation
- noContent
- resetContent
- partialContent
- multiStatus

### 3xx - Redirection
- multipleChoices
- movedPermanently
- movedTemporarily
- seeOther
- notModified
- useProxy
- unused
- temporaryRedirect

### 4xx - Client Error
- badRequest
- unauthorized
- paymentRequired
- forbidden
- notFound
- methodNotAllowed
- notAcceptable
- proxyAuthenticationRequired
- requestTimeout
- conflict
- gone
- lengthRequired
- preconditionFailed
- requestEntityTooLarge
- requestUriTooLong
- unsupportedMediaType
- requestedRangeNotSatisfiable
- expectationFailed
- iAmATeapot
- unprocessableEntity
- locked
- failedDependency
- upgradeRequired
- preconditionRequired
- tooManyRequests
- requestHeaderFieldsTooLarge
- unavailableForLegalReasons

### 5xx - Server Error
- internalServerError
- notImplemented
- badGateway
- serviceUnavailable
- gatewayTimeout
- httpVersionNotSupported
- insufficientStorage
- networkAuthenticationRequired-
