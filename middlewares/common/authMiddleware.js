const jwt = require("jsonwebtoken");
const {isTokenBlacklisted} = require("./errorHandler");

const authMiddleware = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        const token = authorization.split(" ")[1];
        if (await isTokenBlacklisted(token)) {
            return res.status(401).json({
                errors: {
                    common: {
                        msg: "User disabled. Please log out.",
                    },
                },
            });
        } else {
            const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
            const {email, id, role} = jwtPayload;
            req.loggedInUser = {
                email,
                id,
                role,
            };
            next();
        }
    } catch {
        res.status(401).json({
            errors: {
                common: {
                    msg: "Authentication failure!",
                },
            },
        });
    }
};

module.exports = authMiddleware;
