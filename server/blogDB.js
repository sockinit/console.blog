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
        layoutPath: '../views/layout',
        helpersPath: '../views/helpers',
        // partialsPath: '../views/partials'
    });
    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: function(request, reply) {
                handlers.getLandingDashboard(request, reply);
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/dashboard/{user}',
        config: {
            handler: function(request, reply) {
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
            handler: function(request, reply) {
                handlers.editPost(request, reply);
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/dashboard/{user}/save/{id}',
        config: {
            handler: function(request, reply) {
                handlers.saveEditedPost(request, reply);
            }
        }
    });

    next();
};


exports.register.attributes = {
    name: 'blogDB'
};
