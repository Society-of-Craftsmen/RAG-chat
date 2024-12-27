import admin from 'firebase-admin';

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
        return res.status(401).json({error: "Unathorized access"});
    }

    try {
        const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));

        // Initialize Firebase Admin SDK
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; 
        next();
    } catch {
        return res.status(401).json({error: "Invalid token"});
    }
};