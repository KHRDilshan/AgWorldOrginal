const jwt = require('jsonwebtoken');
const db = require('../startup/database');

const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'No token provided',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
      });
    }
    
    console.log('Decoded token:', decoded); 
    req.user = decoded;
    next();
  });
};

module.exports = auth;


// const jwt = require('jsonwebtoken');

// const auth = (req, res, next) => {
//   try {
//     // Extract the token from the "Authorization" header
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'Authorization header is missing',
//       });
//     }

//     const token = authHeader.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'Token is missing',
//       });
//     }

//     // Verify the JWT token
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//       if (err) {
//         const message = err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
//         return res.status(401).json({
//           status: 'error',
//           message,
//         });
//       }

//       // Attach decoded token to req.user
//       req.user = decoded;
//       console.log('Decoded token:', decoded); // For debugging
//       next();
//     });
//   } catch (error) {
//     console.error('Unexpected error in auth middleware:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Server error',
//     });
//   }
// };

// module.exports = auth;
