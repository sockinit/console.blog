// 'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();
var Inert = require('inert');
var Vision = require('vision');
var Validate = require('./validate.js');
var blogDB = require('./blogDB.js');
var Handlebars = require('handlebars');
var Basic = require('hapi-auth-basic');
var client = require('./redis.js');

//TODO register custom plugins
//TODO add validate back in there

var plugins = [Inert, Vision, Basic, blogDB];


server.connection({
    port: process.env.PORT || 3000
});

server.register(plugins, function(err) {
    var Bcrypt = require('bcrypt');
    var validate = function (request, username, password, callback) {

        client.SMEMBERS('users', function(err, response){
            if(err){
                throw err;
            }

            var userRes = response.filter(function(item){
                var user = JSON.parse(item);
                return user.username === username;
            });
            if (userRes.length > 0) {
                var deets = JSON.parse(userRes[0]);
                Bcrypt.compare(password, deets.password, function(err, isValid) {
                    callback(err, isValid, {username: deets.username});
                });
            } else {
                return callback (null, false);
            }
        });
    };
    server.auth.strategy('simple', 'basic', { validateFunc: validate });

    server.route({
        method: 'GET',
        path: '/users',
        config: {
            auth: 'simple',
            handler: function ( request, reply ){
                    reply(+request.auth.credentials.username);
                }
            }
    });

    server.route({
          method: 'GET',
          path: '/{param*}',
          handler: {
            directory: {
              path: 'public'
            }
          }
    });

    console.log('err---->', err);
});

server.start(function(err) {
    if (err) throw err;
    console.log("Server is running at: ", server.info.uri);
});

module.exports = server;

(function init() {
    console.log('init function is running');
    client.sadd('users',
        JSON.stringify({username: 'ivan', password: '$2a$08$OA3Eidr7fkq7oobrbDOZ5eXHGMGprcMJoxLXV9Kcxhf/HyQCGuRB2'}),
        JSON.stringify({username: 'tom', password: '$2a$08$Krn4y6FzCrdmRR26b2haO.PkO84PiG.LM7SogY4XdUQTNTjprXO/u'}),
        JSON.stringify({username: 'virginia', password: '$2a$08$yzDQiMSItJr/62InGearHeFy1IBo2BLXsQtKM5hqQKqjJ9GcvJgd.'}),
        JSON.stringify({username: 'jack', password: '$2a$08$u/9WsZcYA1VapdBzC1H3b.JrasR6gsJF6bQiOGAn0sAnl7CFqgmGe'}), function(err) {
            if (err) {
                console.log(err);
            }
        });
})();
