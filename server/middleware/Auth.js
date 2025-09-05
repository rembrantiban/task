import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  console.log('Token found:', token);

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('JWT verification failed:', error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

 export default requireAuth;