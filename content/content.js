'use strict';

const fs = require('fs');

var content;
var thumbnails;

const playlistCache = {};

reloadContent();

function reloadContent() {
  fs.readFile(__dirname + "/../playlists.json", (error, data) => {
    if (error) { return console.error(error); }
    try {
      content = JSON.parse(data);
    } catch (error) {
      return console.error(error);
    }
  });
  fs.readFile(__dirname + "/../thumbnails.json", (error, data) => {
    if (error) { return console.error(error); }
    try {
      thumbnails = JSON.parse(data);
    } catch (error) {
      return console.error(error);
    }
  });
}


fs.watch(__dirname + "/../playlists.json", () => {
  setTimeout(() => reloadContent(), 1000);
});
fs.watch(__dirname + "/../thumbnails.json", () => {
  setTimeout(() => reloadContent(), 1000);
});


fs.watch(__dirname + '/../playlists', (eventType, filename) => {
  setTimeout(() => {
    fs.access(__dirname + '/../playlists/' + filename, fs.F_OK, (error) => {
      if (error) { return console.error(error); }
      setTimeout(() =>
        fs.readFile(__dirname + '/../playlists/' + filename, (error, data) => {
          if (error) { return console.error(error); }
          try {
            var json = JSON.parse(data);
            playlistCache[json.key] = json;
          } catch (err) {
            return console.error(error);
          }
        }), 1000);
    });
  }, 1000);
});


module.exports = {
  playlists: () => content.playlists,
  dictionary: () => content.dictionary,
  thumbnails: () => thumbnails,
  playlistCache,
  reloadContent
};