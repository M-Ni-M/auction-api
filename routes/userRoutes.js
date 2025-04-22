import { Router } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  generateToken,
  logout,
  getUser,
  getUsers,
} from "../controllers/userController.js";
import passport from "passport";
import authMiddleware from "../middlewares/auth.js";

export const userRouter = Router();

userRouter.post("/user/register", registerUser);
userRouter.post("/user/verify-email", verifyEmail);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/user/login", loginUser);
userRouter.post("/user/logout", authMiddleware, logout);
userRouter.get("/user/:id", getUser);
userRouter.get("/users", getUsers)
userRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    accessType: "offline",
    prompt: "consent",
  })
);

userRouter.get(
  "google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);

    // Set JWT in http-only cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

//export router
export default userRouter;
