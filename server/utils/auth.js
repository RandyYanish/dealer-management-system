import pkg from 'jsonwebtoken';
const { sign, verify, decode } = pkg;

const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRATION;

export function authMiddleware({ req }) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split('').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
}
export function signToken({ email, _id }) {
  const payload = { email, _id };

  return {
    token: sign({ data: payload }, secret, { expiresIn: expiration }),
  };
}
export function authToken(token) {
  try {
    let authed = verify(token, secret, { maxAge: process.env.JWT_EXPIRATION });
    if (authed) {
      let decoded = decode(token);

      return decoded;
    }
  } catch (error) {
    console.log(error);
  }
}