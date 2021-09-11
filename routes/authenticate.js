'use strict';

const express = require('express'),
  passport = require('passport');

require('../strategies');

const router = express.Router();

router.get('/', passport.authenticate('wolkeneis'));

router.get('/callback', passport.authenticate('wolkeneis', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/authenticate/success');
});

router.get('/success', (req, res) => {
  var options = {
    controlOrigin: process.env.CONTROL_ORIGIN
  };
  res.sendStatus(200);
});

module.exports = router;