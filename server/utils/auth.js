import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

// Set the secret and expiration date variables in the .env file
const secret = process.env.JWT_SECRET;
const expiration = process.env.JWT_EXPIRATION;

// authMiddleware function
export function authMiddleware({ req }) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(' ')[1];
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

// signToken function
export function signToken({ email, _id }, secret, expiration) {
  const payload = { email, _id };
  return {
    token: sign({ data: payload }, secret, { expiresIn: expiration }),
  };
}

// authToken function
export function authToken(token, secret, expiration) {
  try {
    // Verify token
    let decoded = verify(token, secret, { maxAge: expiration });
    if (decoded) {
      return decoded;
    }
  } catch (error) {
    console.log(error);
  }
}