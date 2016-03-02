// 'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();
var Inert = require('inert');
var Vision = require('vision');
var Validate = require('./validate.js');
var blogDB = require('./blogDB.js');
var Handlebars = require('handlebars');

//TODO register custom plugins
//TODO add validate back in there

var plugins = [Inert, Vision, blogDB];

server.connection({
    port: process.env.PORT || 3000
});

server.register(plugins, function(err) {
    console.log('err---->', err);
});

server.start(function(err) {
    if (err) throw err;
    console.log("Server is running at: ", server.info.uri);
});

module.exports = server;
