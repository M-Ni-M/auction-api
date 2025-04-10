import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController.js";


export const userRouter = Router();

userRouter.post("/user/register", registerUser);
userRouter.post("/user/login", loginUser);

//export router
export default userRouter;