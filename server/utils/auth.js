const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware for authenticating protected routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // If token is included in the headers (format: "Bearer <tokenvalue>")
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    // If token is not present, return the request object as is
    if (!token) {
      return req;
    }

    // Verify token and extract user data
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;   // Attach user data to the request object
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    return req;  // Return the updated request object
  },
  // Function for creating JWT tokens
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id }; // User data to include in the token
    // Generate and return the JWT token with the user data
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
