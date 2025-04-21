import { expressjwt } from "express-jwt";

const authMiddleware = (req, res, next) => {
  expressjwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ["HS256"],
  })(req, res, (err) => {
    if (err) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }
    next();
  });
};

export default authMiddleware;
