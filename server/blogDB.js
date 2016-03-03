'use strict';

var client = require('./client.js')('blog');
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
        path: '/dashboard/{user}',
        config: {
            handler: function(request, reply) {
                console.log('a log', reply, request.params.user);
                function retrieveBlogs(client, callback) {
                    client.LRANGE('posts', 0, -1, function(err, reply) {
                        if (err) {
                            console.log(err);
                        } else {

                            callback(reply);
                        }
                    });
                }
                retrieveBlogs(client, function(postObjectsArray) {
                    reply.view('home', {data: postObjectsArray});
                });
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/dashboard/{user}/new-post',
        config: {
            handler: function(request, reply) {
                reply.view('new-post');
            }
        }
    });

    // adds date, author, id to db once publish button is clicked
    //TODO check button compatibility

    server.route({
        method: 'POST',
        path: '/dashboard/{user}/publish',
        config: {
            handler: function(request, reply) {
                let dateObj = new Date();
                let day = dateObj.getDate();
                let month = dateObj.getMonth() + 1;
                let year = dateObj.getFullYear();
                let today = day + '/' + month + '/' + year;
                console.log(today);
                request.payload.id = Date.now();
                request.payload.author = request.params.user;
                request.payload.date = today;
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
                    reply.redirect('/dashboard/' + request.params.user);
                });
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/dashboard/{user}/edit-post/{id}',
        config: {
            handler: function(request, reply) {
                function retrieveBlogs(client, callback) {
                    client.LRANGE('posts', 0, -1, function(err, reply) {
                        if (err) {
                            console.log(err);
                        } else {

                            callback(reply);
                        }
                    });
                }
            }
        }
    });

    next();
};


exports.register.attributes = {
    name: 'blogDB'
};
