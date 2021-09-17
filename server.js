"use strict";

//var pkg = require("./package.json");
var app = require("./app.js");

require("greenlock-express")
    .init({
        // where to find .greenlockrc and set default paths
        packageRoot: __dirname,

        // where config and certificate stuff go
        configDir: "./greenlock.d",

        // contact for security and critical bug notices
        maintainerEmail: process.env.MAINTAINER_EMAIL,

        // name & version for ACME client user agent
        //packageAgent: pkg.name + "/" + pkg.version,

        // whether or not to run at cloudscale
        cluster: false
    })
    .serve(app);