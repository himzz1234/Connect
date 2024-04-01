const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user.model");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://mernsocialmedia.onrender.com/api/auth/google/callback",
    },
    async function (profile, done) {
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
