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







// var tape = require('tape');
// var blogDB = require('../server/blogDB.js');
// var server = require('../server/server.js').server;
// var shot = require('shot');
// var redisMock = require('redis-mock');
// var clientMock = redisMock.createClient();
// var client = require('../server/client.js');
//
// var testObj = {
//   author : 'Norbert',
//   title : 'awesome blog',
//   content : 'someimagestring',
//   date : '21/01/1990'
// };
//
// tape('Testing Tests', function(t){
//         t.equal(1, 1, 'success!!');
//         t.end();
// });
//
// tape('Function addToDB adds blogObject to database', function(t){
//         blogDB.addToDB(clientMock, testObj, function(reply){
//         var expected = 'number';
//         var actual = reply;
//         t.equal(typeof actual, expected);
//         t.end();
//     });
// });
//
// tape('Function retrieveBlogs retrieves an array', function(t){
//     blogDB.retrieveBlogs(client, function(reply){
//         var actual =  reply instanceof Array;
//         t.ok(actual, 'Blogs are returned');
//         t.end();
//     });
// });
