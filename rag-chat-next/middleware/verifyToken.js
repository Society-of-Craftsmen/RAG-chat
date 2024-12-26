import admin from 'firebase-admin';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({error: "Unathorized access"});
    }

    try {
        const decodedToken = admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch {
        return res.status(401).json({error: "Invalid token"});
    }
};