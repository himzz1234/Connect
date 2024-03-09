const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.model");

const GOOGLE_CLIENT_ID =
  "139040244411-o11687g5s7a80g2t52lputcbf8dmfav6.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8800/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      const { sub, name, picture, email } = profile._json;

      let user = await User.findOne({ email: email });
      if (!user) {
        user = await User.create({
          username: name,
          googleId: sub,
          profilePicture: picture,
          email: email,
        });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.googleId);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findOne({ googleId: id });
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
});
