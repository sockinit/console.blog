var client = require('./client.js');
var Vision = require('vision');
var Handlebars = require('handlebars');
// var Inert = require('inert');

exports.register = function(server, options, next) {

    server.views({
        engines: { html: Handlebars },
        relativeTo: __dirname,
        path: '../views',
        layout: 'default',
        layoutPath: '../views/layout'
    });

    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply) {
                function retrieveBlogs(client, callback) {
                    //uncomment following line and refresh page if you want to
                    //flush DB
                    // client.flushall();
                    client.LRANGE('posts', 0, -1, function(err, reply) {
                        if (err) {
                            console.log(err);
                        } else {
                            callback(reply);
                        }
                    });
                }
                retrieveBlogs(client, function(postObjectsArray) {
                    // typeof postObjectsArray is object here
                    var parsedArray = postObjectsArray.map(function(el) {
                        return JSON.parse(el);
                    }).reverse();
                    console.log('parsedobjects ------',parsedArray);
                    // var keysArray = Object.keys(postObjectsArray);
                    reply.view('home', {data: parsedArray});
                });
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/new-post',
        config: {
            handler: function(request, reply) {
                reply.view('new-post');
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/form',
        config: {
            handler: function(request, reply) {
                var postObj = JSON.stringify(request.payload);
                console.log('payload______>', request.payload, postObj);
                function addToDB(client, callback) {
                    client.rpush('posts', postObj, function(err, reply) {
                        if (err) {
                            console.log(err);
                        } else {
                            callback(reply);
                        }
                    });
                }
                addToDB(client, function() {
                    reply.redirect('/');
                });
            }
        }
    });

    next();
};


exports.register.attributes = {
    name: 'blogDB'
};
