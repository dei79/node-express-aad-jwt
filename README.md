# express-aad-jwt

[![Build](https://travis-ci.org/dei79/node-express-aad-jwt.png)](http://travis-ci.org/dei79/node-express-aad-jwt)

Middleware that validates JsonWebTokens issued from Azure Active Directory and sets `req.user`.

This module lets you authenticate HTTP requests using JWT tokens issued from Azure Active Directory in your Node.js
applications.  JWTs are typically used to protect API endpoints, and are often issued using OpenID Connect.

## Install

    $ npm install express-aad-jwt

## Usage

The JWT authentication middleware authenticates callers using a JWT.
If the token is valid, `req.user` will be set with the JSON object decoded
to be used by later middleware for authorization and access control.

For example,

```javascript
var jwt = require('express-aad-jwt');

app.get('/protected',
  jwt(),
  function(req, res) {
    if (!req.user.admin) return res.send(401);
    res.send(200);
  });
```

You can specify audience and/or issuer as well:

```javascript
jwt(audience: 'http://myapi/protected',
    issuer: 'http://issuer' })
```

> If the JWT has an expiration (`exp`), it will be checked.

Optionally you can make some paths unprotected as follows:

```javascript
app.use(jwt().unless({path: ['/token']}));
```

This is especially useful when applying to multiple routes.

By default, the decoded token is attached to `req.user` but can be configured with the `requestProperty` option.

```javascript
jwt({ requestProperty: 'auth' });
```

### Error handling

The default behavior is to throw an error when the token is invalid, so you can add your custom logic to manage unauthorized access as follows:


```javascript
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.send(401, 'invalid token...');
  }
});
```

You might want to use this module to identify registered users without preventing unregistered clients to access to some data, you
can do it using the option _credentialsRequired_:

    app.use(jwt({
      credentialsRequired: false
    }));

## Related Modules

- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — JSON Web Token sign and verification

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Tests

    $ npm install
    $ npm test

## Contributors
Check them our [here](https://github.com/dei79/node-express-aad-jwt/graphs/contributors)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
