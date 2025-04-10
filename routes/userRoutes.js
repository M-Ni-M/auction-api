import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  generateToken,
  logout,
} from "../controllers/userController.js";
import passport from "passport";
import { auth } from "../middlewares/auth.js";

export const userRouter = Router();

userRouter.post("/user/register", registerUser);
userRouter.post("/user/verify-email", verifyEmail);
userRouter.post("/user/login", loginUser);
userRouter.post("/user/logout", auth, logout);

userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

userRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/user/login",
  }),
  (req, res) => {
    const token = generateToken(req.user._id);

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

//export router
export default userRouter;
