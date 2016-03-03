'use strict';

var client = require('./client.js')('blog');
var Vision = require('vision');
var Handlebars = require('handlebars');
// var Inert = require('inert');


exports.register = function(server, options, next) {

    server.views({
        engines: {
            html: Handlebars
        },
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
                reply.redirect('/users');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/dashboard/{user}',
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
                    // var keysArray = Object.keys(postObjectsArray);
                    reply.view('home', {
                        data: parsedArray
                    });
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

    server.route({
        method: 'GET',
        path: '/dashboard/{user}/{id}/delete',
        config: {
            handler: function(request, reply) {
                console.log('reached handler');

                function deletePost(client, objToBeDeleted, callback) {
                    client.lrem('posts', 0, objToBeDeleted, function(err, reply) {
                        if (err) {
                            console.log(err);
                        } else {
                            callback(reply);
                        }
                    });
                }
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
                    var id = request.params.id;
                    var objToBeDeleted = postObjectsArray.filter(function(el) {
                        return el.indexOf(id) > -1;
                    })[0];
                    deletePost(client, objToBeDeleted, function() {
                        reply.redirect('/dashboard/' + request.params.user);
                    });
                });
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
        path: '/edit-post/id',
        config: {
            handler: function(request, reply) {

            }
        }
    });

    next();
};


exports.register.attributes = {
    name: 'blogDB'
};
