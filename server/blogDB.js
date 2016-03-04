'use strict';

var client = require('./client.js')('blog');
var Vision = require('vision');
var Handlebars = require('handlebars');

var handlers = require('./dashboardHandlers.js');

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
                    reply.view('landing', {
                        data: parsedArray
                    });
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/dashboard/{user}',
        config: {
            handler: function (request, reply){
                handlers.getDashboard(request, reply);
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
                handlers.deletePostHandler(request, reply);
            }
        }
    });


    server.route({
        method: 'POST',
        path: '/dashboard/{user}/publish',
        config: {
            handler: function(request, reply) {
                handlers.publishPost(request, reply);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/dashboard/{user}/edit-post/{id}',
        config: {
            handler: function(request, reply){
                handlers.editPost(request, reply);
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/dashboard/{user}/save/{id}',
        config: {
            handler: function(request, reply){
                handlers.saveEditedPost(request, reply);
            }
        }
    });

    next();
};


exports.register.attributes = {
    name: 'blogDB'
};
