import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token =  jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
    res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'production', // Ensures 'secure: true' on Vercel
        sameSite: 'None', // <<< --- IMPORTANT CHANGE FOR CROSS-SITE COOKIES
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};
export default generateToken;