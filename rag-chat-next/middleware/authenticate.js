import admin from 'firebase-admin';

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.spli('Bearer ')[1];
    if (!token) {
        return res.status(401).json({error: "Unathorized access"});
    }
    next();
};