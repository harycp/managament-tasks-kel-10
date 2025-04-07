const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const User = require("../models/user");
const { generateToken } = require("../utils/jwt");

require("dotenv").config();

const findOrCreateUser = async (profile) => {
  let user = await User.findOne({
    where: { email: profile.emails[0].value },
    paranoid: false,
  });

  if (user) {
    if (user.deletedAt) {
      await user.restore();
    }
  } else {
    user = await User.create({
      username:
        profile.username ||
        profile.displayName.replace(/\s+/g, "").toLowerCase(),
      email: profile.emails[0].value,
      name: profile.displayName,
      password: "oauth",
    });
  }

  return user;
};

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        const token = generateToken(user);
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Github OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile);
        const token = generateToken(user);
        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
