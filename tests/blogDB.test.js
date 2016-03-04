var tape = require('tape');
var hapi = require('hapi');
var server = require('../server/server.js');

tape('200 status code responded with /users', function(t) {
    var options = {
        method: 'GET',
        url: '/'
    };
    server.inject(options, function(reply) {
        t.equal(reply.statusCode, 200, 'route / returns 200');
        t.end();
    });
});

tape('/ route response is an object', function(t) {
    var options = {
        method: 'GET',
        url: '/'
    };
    server.inject(options, function(reply) {
        t.ok(reply.payload.indexOf('[]') > -1, 'we is getting an object back');
        t.end();
    });
});
