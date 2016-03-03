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
        path: '/dashboard/{user}/new-post',
        config: {
            handler: function(request, reply) {
                reply.view('new-post');
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/dashboard/{user}/delete',
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

                    console.log("postObjectsArray========", postObjectsArray);
                });


                // function deletePost(client, objToBeDeleted, callback) {
                //     client.lrem('posts', 0, objToBeDeleted, function(err, reply) {
                //         if (err) {
                //             console.log(err);
                //         } else {
                //             callback(reply);
                //         }
                //     });
                // }
                // deletePost(client, objToBeDeleted, function() {
                //     reply.redirect('/dashboard/' + request.params.user);
                // });
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
                console.log('this posts id is: ' + request.payload.id);
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
                retrieveBlogs(client, function(blogPosts){
                    // console.log(blogPosts);
                    blogPosts.forEach(function(post){
                        var postObj = JSON.parse(post);
                        if(postObj.id.toString() === request.params.id){

                            reply.view('new-post', {data: postObj});
                        }
                    });
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/dashboard/{user}/save/{id}',
        config: {
            handler: function(request, reply) {
                retrieveBlogs(client, function(array){
                    array.forEach(function(post){
                        var postObj = JSON.parse(post);
                        // console.log(request.params.id.toString(), ': is the id from the params should equal ' + postObj.id);
                        if(request.params.id === postObj.id.toString()){
                            client.lrem('posts', 0, JSON.stringify(postObj), function(err,response){
                                console.log('removing from db');

                                if(err) {
                                    console.log(err);
                                }
                                else {
                                    postObj.blog = request.payload.blog;
                                    addToDB(client, JSON.stringify(postObj), function(){
                                        console.log('adding to db');
                                        reply.redirect('/dashboard/'+request.params.user);
                                    });

                                }
                            });
                        }
                        // return JSON.stringify(postObj);
                    });

                    //TODO update the database with new array
                    //     reply with correct screen

                });
                // reply.redirect('/dashboard/' + request.params.user);
            }
        }
    });

    next();
};

function retrieveBlogs(client, callback) {
    client.LRANGE('posts', 0, -1, function(err, reply) {
        if (err) {
            console.log(err);
        } else {
            callback(reply);
        }
    });
}

function addToDB(client, postObj, callback) {
    client.rpush('posts', postObj, function(err, reply) {
        if (err) {
            console.log(err);
        } else {
            callback(reply);
        }
    });
}

exports.register.attributes = {
    name: 'blogDB'
};
