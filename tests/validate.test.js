var tape = require('tape');
var hapi = require('hapi');
var server = require('../server/server.js');


tape('200 status code responded with /users', function(t) {
    var options = {
        method: 'GET',
        url: '/users'
    };
    server.inject(options, function(reply){
        t.equal(reply.statusCode, 200, 'route /users/tom returns 200');
        t.end();
    });
});

tape('unrecognised username', function(t) {
    var options = {
        method: 'GET',
        url: '/users'
    };
    var actual = 'jonny';
    var expected = false;
    server.inject(options, function(reply) {
        t.equal(actual, expected, 'user is not recognised');
        t.end();
    });
});

tape('teardown', function(t){
    server.stop(t.end);
});
