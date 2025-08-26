const jwt = require('jsonwebtoken');
module.exports = async function(req, res, next) {

  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; 
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
