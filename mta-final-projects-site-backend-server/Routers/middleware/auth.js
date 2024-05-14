// const jwt = require('jsonwebtoken');
// const secretKey = 'SuperKey123'; // Replace with your own secret key

// const authenticateToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }

//     req.user = decoded.data;
//     next();
//   });
// };

// const authorizeAdmin = (req, res, next) => {
//   if (req.user.type !== 'admin') {
//     return res.status(403).json({ error: 'Unauthorized' });
//   }

//   next();
// };

// module.exports = {
//   authenticateToken,
//   authorizeAdmin,
// };