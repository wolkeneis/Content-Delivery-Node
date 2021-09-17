'use strict';

const fs = require('fs'),
  express = require('express'),
  passport = require('passport');

const { content, database } = require('../content');

const router = express.Router();

router.use(checkDataAccess);

router.get('/playlists',
  (req, res) => {
    return res.json(content.playlists().filter(playlist => !playlist.scope || database.checkScope(req.user.id, playlist.scope)));
  });

router.get('/playlist/:playlist',
  (req, res) => {
    var playlistKey = req.params.playlist;
    if (content.dictionary()[playlistKey]) {
      if (!content.playlistCache[playlistKey]) {
        content.playlistCache[playlistKey] = JSON.parse(fs.readFileSync(__dirname + "/../playlists/" + content.dictionary()[playlistKey]));
      }
      return res.json({
        name: content.playlistCache[playlistKey].name,
        key: content.playlistCache[playlistKey].key,
        seasons: content.playlistCache[playlistKey].seasons,
      });
    }
    return res.sendStatus(404);
  });

router.get('/episode/:playlist/:episode',
  (req, res) => {
    const playlistKey = req.params.playlist;
    if (content.dictionary()[playlistKey]) {
      if (!content.playlistCache[playlistKey]) {
        content.playlistCache[playlistKey] = JSON.parse(fs.readFileSync(__dirname + "/../playlists/" + content.dictionary()[playlistKey]));
      }
      const season = content.playlistCache[playlistKey].seasons.find(season => season.episodes.find(episode => episode.key === req.params.episode) !== undefined);
      if (!season) {
        return res.sendStatus(404);
      }
      const episode = season.episodes.find(episode => episode.key === req.params.episode);
      return res.json({
        name: episode.name,
        index: episode.index,
        available: episode.available,
        key: episode.key
      });
    }
    return res.sendStatus(404);
  });

router.get('/source/:playlist/:episode',
  (req, res) => {
    const playlistKey = req.params.playlist;
    const sourceId = req.params.episode;
    var source;
    if (content.playlistCache[playlistKey]) {
      source = content.playlistCache[playlistKey].dictionary[sourceId];
    } else {
      if (content.dictionary()[playlistKey]) {
        content.playlistCache[playlistKey] = JSON.parse(fs.readFileSync(__dirname + "/../playlists/" + content.dictionary()[playlistKey]));
        source = content.playlistCache[playlistKey].dictionary[sourceId];
      }
    }
    if (!source) {
      return res.sendStatus(404);
    }
    console.log(`${req.user.username} (${req.user.id}) accessed ${source} at ${new Date()}`);
    return res.sendFile(source, {
      root: __dirname + '/../media'
    });
  });

router.get('/thumbnail/:playlist',
  (req, res) => {
    const source = content.thumbnails()[req.params.playlist];
    if (source === undefined) {
      return res.sendStatus(404);
    }
    return res.sendFile(source, {
      root: __dirname + '/../thumbnails'
    });
  });

function checkDataAccess(req, res, next) {
  if (req.isAuthenticated()) {
    if (database.checkScope(req.user.id, 'restricted')) {
      return next();
    } else {
      console.log(`${req.user.username} (${req.user.id}) is not whitelisted and tried to access ${req.originalUrl}`);
      return res.sendStatus(403);
    }
  } else {
    console.log(`${req.ip} tried to access ${req.originalUrl} without being logged in`);
    return res.sendStatus(401);
  }
}

module.exports = router;