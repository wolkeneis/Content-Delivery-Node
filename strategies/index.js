'use strict';

const passport = require('passport'),
  WolkeneisStrategy = require('passport-wolkeneis').Strategy;

passport.serializeUser((user, callback) => {
  callback(undefined, user);
});
passport.deserializeUser((obj, callback) => {
  callback(undefined, obj);
});

passport.use(new WolkeneisStrategy({
  authorizationURL: process.env.AUTH_URL,
  tokenURL: process.env.TOKEN_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  userProfileURL: process.env.PROFILE_URL
}, (accessToken, refreshToken, profile, callback) => {
  callback(undefined, profile);
}));