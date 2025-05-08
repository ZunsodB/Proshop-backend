import asyncHandler from "../middleware/asyncHandler.js";
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId || decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      } 
      next();
    } catch (error) {
      console.error('Token verification error:', error.message); 
      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Not authorized, token expired');
      } else if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error('Not authorized, invalid token signature');
      } else {
        res.status(401);
        throw new Error('Not authorized, token verification failed');
      }
    }
  });

const admin = (req, res, next) => { 
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
}
export {
    protect,
    admin,
}