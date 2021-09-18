'use strict';

const express = require('express'),
  { ensureLoggedIn } = require('connect-ensure-login');

const { database } = require('../content');

require('../strategies');

const router = express.Router();

router.get('/',
  ensureLoggedIn("/authenticate"),
  (req, res) => {
    const user = req.user;
    res.json({
      username: user.username,
      avatar: user.avatar,
      authorized: database.checkScope(user.id, 'restricted')
    });
  });

router.get('/logout', (req, res) => {
  //req.logout();
  res.redirect(process.env.CONTROL_ORIGIN + '/redirect/nodes');
});

module.exports = router;