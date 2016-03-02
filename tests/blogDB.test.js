var tape = require('tape');
var blogDB = require('../server/blogDB.js');
var server = require('../server/server.js').server;
var shot = require('shot');
var redisMock = require('redis-mock');
var clientMock = redisMock.createClient();
var client = require('../server/client.js');

var testObj = {
  author : 'Norbert',
  title : 'awesome blog',
  content : 'someimagestring',
  date : '21/01/1990'
};

tape('Testing Tests', function(t){
        t.equal(1, 1, 'success!!');
        t.end();
});

tape('Function addToDB adds blogObject to database', function(t){
        blogDB.addToDB(clientMock, testObj, function(reply){
        var expected = 'number';
        var actual = reply;
        t.equal(typeof actual, expected);
        t.end();
    });
});

tape('Function retrieveBlogs retrieves an array', function(t){
    blogDB.retrieveBlogs(client, function(reply){
        var actual =  reply instanceof Array;
        t.ok(actual, 'Blogs are returned');
        t.end();
    });
});
