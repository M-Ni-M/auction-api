import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginUserValidator,
  registerUserValidator,
} from "../validators/userValidator.js";
import { UserModel } from "../models/users.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.js";

export const registerUser = async (req, res, next) => {
  try {
    //validate user information
    const { error, value } = registerUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    //check if user exists already
    const user = await UserModel.findOne({
      $or: [{ username: value.username }, { email: value.email }],
    });
    if (user) {
      return res.status(409).json("user already exists");
    }
    //hash plaintext password
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    const verificationCode = crypto.randomBytes(3).toString("hex");
    //create user record in database
    const result = await UserModel.create({
      ...value,
      password: hashedPassword,
      verificationCode: verificationCode,
      verified: false,
    });

    await sendVerificationEmail(value.email, verificationCode, result.username);
    //return response
    return res
      .status(201)
      .json({ message: `Welcome ${value.username} to Finalisima` });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid Verification Code" });
    }

    user.verified = true;
    await user.save();

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    return res
      .status(200)
      .json({
        message: "Email Verified Successfully",
        accessToken,
        user: { id: user.id },
      });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    //validate user information
    const { error, value } = loginUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    // find matching user record in database
    const user = await UserModel.findOne({
      $or: [{ username: value.username }, { email: value.email }],
    });
    if (!user) {
      return res.status(404).json("user does not exists");
    }

    // Check if the user has verified their email
    if (!user.verified) {
      return res
        .status(403)
        .json({ message: "Forceable Entry!,Email Verification Required" });
    }
    //compare incoming password with saved password
    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if (!correctPassword) {
      return res.status(401).json("invalid credentials");
    }
    //generate access token for user
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });
    //return response
    return res
      .status(200)
      .json({
        message: "Login Successfull",
        accessToken,
        user: { id: user.id },
      });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.status(200).json("Logout Successful");
};

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
};
