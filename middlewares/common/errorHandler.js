const createError = require("http-errors");
const BlacklistedToken = require("../../models/BlackListToken");
const jwt = require("jsonwebtoken");

const notFoundHandler = (req, res, next) => {
    next(createError(404, "Your requested content was not found!"));
};

//default error handler
const errorHandler = (err, req, res, next) => {
    const errors =
        process.env.NODE_ENV === "development" ? err : {message: err.message};
    res.status(err.status || 500);
    res.json(errors);
};

const isTokenBlacklisted = async (token) => {
    try {
        const blacklisted = await BlacklistedToken.findOne({token});
        return !!blacklisted;
    } catch (error) {
        throw new Error('Error checking token blacklist');
    }
};

const authStatusMiddleware = async (req, res, next) => {
    try {
        const {authorization} = req.headers;
        const token = authorization.split(" ")[1];
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
        const {email, id, role} = jwtPayload;
        req.loggedInUser = {
            email,
            id,
            role,
        };
        next();
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


module.exports = {
    notFoundHandler,
    errorHandler,
    isTokenBlacklisted,
    authStatusMiddleware
};
