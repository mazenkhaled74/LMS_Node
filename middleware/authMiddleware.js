import jwt from "jsonwebtoken";

class AuthMiddleware {
    static extractUser(secret, req) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.split(" ")[1];

        try {
            return jwt.verify(token, secret);
        } 
        catch (error) {
            return null;
        }
    }

    static authorize(secret, allowedRoles = []) {
        return function (req, res, next) {
            const user = AuthMiddleware.extractUser(secret, req);
            if (!user || !user.id || !user.role) {
                return res.status(403).json({ error: "Invalid or expired token." });
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: "Access denied. Unauthorized." });
            }

            req.user = user;
            next();
        };
    }
}

export default AuthMiddleware;
