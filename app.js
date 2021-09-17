'use strict';

require('dotenv').config();

const express = require('express'),
  cors = require('cors'),
  session = require('express-session'),
  FileStore = require('session-file-store')(session),
  passport = require('passport');

const app = express();

app.use(cors({
  origin: process.env.CONTROL_ORIGIN,
  allowedHeaders: 'X-Requested-With, Content-Type',
  credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  store: new FileStore(),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    path: '/',
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 604800000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

const { profile, authenticate, content } = require('./routes');

app.use('/profile', profile);
app.use('/authenticate', authenticate);
app.use('/content', content);

app.get('/', (req, res) => {
  res.json({
    state: process.env.STATE ?? "maintenance", // maintenance, running
    name: process.env.CLIENT_NAME || "Content Node",
  });
});

module.exports = app;
