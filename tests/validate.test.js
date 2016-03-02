var tape = require('tape');
var hapi = require('hapi');
var server = require('../server/server.js');


tape('200 status code responded with /users', function(t) {
    var options = {
        method: 'GET',
        url: '/users/tom'
    };
    server.inject(options, function(reply){
        t.equal(reply.statusCode, 200, 'route /users/tom returns 200');
        t.end();
    });
});

tape('teardown', function(t){
    server.stop(t.end);
});
