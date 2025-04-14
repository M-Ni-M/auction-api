import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/users.js";

// Jwt strategy for API authentication
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_KEY,
      callbackURL: "/api/v1/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails?.length) {
          return done(new Error("No email found in Google Profile"));
        }
        const { email } = profile.emails[0].value;
        const existingUser = await UserModel.findOne({
          $or: [{ googleId: profile.id }, { email: email }],
        });

        if (existingUser) {
          if (!existingUser.googleId) {
            existingUser.googleId = profile.id;
            await existingUser.save();
          }
          return done(null, existingUser);
        } else {
          try {
            const newUser = new UserModel({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              verified: true,
              strategy: "google",
            });
            await newUser.save();
            return done(null, newUser);
          } catch (error) {
            if (error.code === 11000) {
              const existing = await UserModel.findOne({ email });
              return done(null, existing);
            }
            throw error;
          }
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await UserModel.findById(id);
  done(null, user);
});
