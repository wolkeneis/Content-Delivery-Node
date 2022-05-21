'use strict';

const express = require('express');

const { database } = require('../content');

require('../strategies');

const router = express.Router();

router.get('/',
  (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      res.json({
        username: user.username,
        avatar: user.avatar,
        authorized: database.checkScope(user.uid, 'restricted')
      });
    } else {
      res.sendStatus(403);
    }
  });

router.delete('/logout',
  (req, res) => {
    if (req.isAuthenticated()) {
      console.log("auth");
      req.logout();
    }
    res.redirect(process.env.CONTROL_ORIGIN + '/redirect/nodes');
  });

module.exports = router;