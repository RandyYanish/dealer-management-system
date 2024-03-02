const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRATION;

module.exports = {
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split('').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: function ({ email, _id }) {
    const payload = { email, _id };

    return {
      token: jwt.sign({ data: payload }, secret, { expiresIn: expiration }),
    };
  },
  authToken: function (token) {
    try {
      let authed = jwt.verify(token, secret, { maxAge: process.env.JWT_EXPIRATION });
      if (authed) {
        let decoded = jwt.decode(token);

        return decoded;
      }
    } catch (error) {
      console.log(error);
    }
  },
};