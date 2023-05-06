const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    const { email, id, role } = jwtPayload;
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

module.exports = authMiddleware;
