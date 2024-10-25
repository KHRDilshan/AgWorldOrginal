// const jwt = require('jsonwebtoken');
// const db = require('../startup/database');

// const auth = (req, res, next) => {
//   const token = req.headers['authorization']?.split(' ')[1]; 

//   if (!token) {
//     return res.status(401).json({
//       status: 'error',
//       message: 'No token provided',
//     });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'Invalid token',
//       });
//     }
    
//     console.log('Decoded token:', decoded); 
//     req.user = decoded;
//     next();
//   });
// };

// module.exports = auth;

const jwt = require('jsonwebtoken');

// Auth Middleware
const auth = async (req, res, next) => {
  try {
    // Get the token from the authorization header (Bearer <token>)
    const token = req.headers['authorization']?.split(' ')[1];

    // Check if token is present
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Error verifying token:', err);

    // Handle token verification errors
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token',
    });
  }
};

module.exports = auth;
