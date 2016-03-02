var Hapi = require('hapi');
var server = new Hapi.Server();
var Inert = require('inert');
var Vision = require('vision');
var Validate = require('./validate.js');
var Handlebars = require('handlebars');
var Basic = require('hapi-auth-basic');

//TODO register custom plugins

var plugins = [Inert, Vision, Validate, Basic];

server.connection({
    port: process.env.PORT ||3000
});

server.register(plugins, function(err) {
    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    console.log(err);
});

server.start(function(err) {
        if (err) throw err;
        console.log("Server is running at: ", server.info.uri);
});

module.exports = server;
