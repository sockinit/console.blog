var tape = require('tape');
var client = require("../server/client.js")('tape');
var server = require('../server/server.js');

tape('check that fake client exists and that test module works', function(t) {
    t.ok(true);
    t.end();
    t.plan(1);
});

tape('teardown', function(t){
    client.flushdb();
    client.quit();
    t.end();
});
