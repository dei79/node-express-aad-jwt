var jwt                 = require('jsonwebtoken');
var UnauthorizedError   = require('./errors/UnauthorizedError');
var unless              = require('express-unless');
var aad                 = require('azure-ad-jwt');

module.exports = function(options) {
  var _requestProperty = options.userProperty || options.requestProperty || 'user';
  var credentialsRequired = typeof options.credentialsRequired === 'undefined' ? true : options.credentialsRequired;

  var middleware = function(req, res, next) {
    var token;

    if (req.method === 'OPTIONS' && req.headers.hasOwnProperty('access-control-request-headers')) {
      var hasAuthInAccessControl = !!~req.headers['access-control-request-headers']
                                    .split(',').map(function (header) {
                                      return header.trim();
                                    }).indexOf('authorization');

      if (hasAuthInAccessControl) {
        return next();
      }
    }

    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length == 2) {
        var scheme = parts[0];
        var credentials = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        } else {
          return next(new UnauthorizedError('credentials_bad_scheme', { message: 'Format is Authorization: Bearer [token]' }));
        }
      } else {
        return next(new UnauthorizedError('credentials_bad_format', { message: 'Format is Authorization: Bearer [token]' }));
      }
    }

    if (!token) {
        if (credentialsRequired) {
            return next(new UnauthorizedError('credentials_required', { message: 'No authorization token was found' }));
        } else {
            return next();
        }
    }

    aad.verify(token, options, function(err, result) {
        if (err && credentialsRequired) return next(new UnauthorizedError('invalid_token', err));

        req[_requestProperty] = result;
        next(null, result);
    });
  };

  middleware.unless = unless;

  return middleware;
};
