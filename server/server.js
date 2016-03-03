// 'use strict';

var Hapi = require('hapi');
var Inert = require('inert');
var Vision = require('vision');
var Validate = require('./validate.js');
var blogDB = require('./blogDB.js');
var Handlebars = require('handlebars');
var Basic = require('hapi-auth-basic');
var populateDB = require('./populateDB.js');


var server = new Hapi.Server();

var plugins = [Inert, Vision, Basic, blogDB, Validate];


server.connection({
    port: process.env.PORT || 4005
});

server.register(plugins, function(err) {
    if(err){
        console.log('err---->', err);
    }

    server.route({
          method: 'GET',
          path: '/public/{param*}',
          handler: {
            directory: {
              path: 'public'
            }
          }
    });
});


module.exports = server;
