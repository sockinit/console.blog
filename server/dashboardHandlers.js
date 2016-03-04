var client = require('./client.js')('blog');


//get user Dashboard
var getDashboard = function (request, reply) {
        retrieveBlogs(client, function(postObjectsArray) {
            var parsedArray = postObjectsArray.map(function(el) {
                return JSON.parse(el);
            }).reverse();
            reply.view('home', {
                data: parsedArray
            });
        });
};

//delete post
var deletePostHandler = function (request, reply){

    retrieveBlogs(client, function(postObjectsArray) {
        var id = request.params.id;
        var objToBeDeleted = postObjectsArray.filter(function(el) {
            return el.indexOf(id) > -1;
        })[0];

        deletePost(client, objToBeDeleted, function() {
            reply.redirect('/dashboard/' + request.params.user);
        });
    });
};


// publish post
var publishPost = function(request, reply) {
    var dateObj = new Date();
    var day = dateObj.getDate();
    var month = dateObj.getMonth() + 1;
    var year = dateObj.getFullYear();
    var today = day + '/' + month + '/' + year;
    request.payload.id = Date.now();
    request.payload.author = request.params.user;
    request.payload.date = today;

    var postObj = JSON.stringify(request.payload);

    addToDB(client, postObj, function() {
        reply.redirect('/dashboard/' + request.params.user);
    });
};

// user selects a post to be edited
var editPost = function(request, reply) {
    retrieveBlogs(client, function(blogPosts){
        // console.log(blogPosts);
        blogPosts.forEach(function(post){
            var postObj = JSON.parse(post);
            if(postObj.id.toString() === request.params.id){
                reply.view('new-post', {data: postObj});
            }
        });
    });
};

// save edited post
var saveEditedPost = function(request, reply) {
    retrieveBlogs(client, function(array){
        array.forEach(function(post){
            var postObj = JSON.parse(post);
            // console.log(request.params.id.toString(), ': is the id from the params should equal ' + postObj.id);
            if(request.params.id === postObj.id.toString()){
                //call delete post????
                client.lrem('posts', 0, JSON.stringify(postObj), function(err,response){
                    if(err) {
                        console.log(err);
                    }
                    else {
                        postObj.blog = request.payload.blog;

                        addToDB(client, JSON.stringify(postObj), function(){
                            reply.redirect('/dashboard/'+request.params.user);
                        });
                    }
                });
            }
        });
    });
};

// Functions to DB

function addToDB(client, postObj, callback) {
    client.rpush('posts', postObj, function(err, reply) {
        if (err) {
            console.log(err);
        } else {
            callback(reply);
        }
    });
}

function deletePost(client, objToBeDeleted, callback) {
    console.log(' 4 made it here');
    client.lrem('posts', 0, objToBeDeleted, function(err, reply) {
        if (err) {
            console.log(' 5 made it error');

            console.log(err);
        } else {
            console.log(' 6 made it here');

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



module.exports = {
    getDashboard: getDashboard,
    deletePostHandler: deletePostHandler,
    publishPost: publishPost,
    editPost: editPost,
    saveEditedPost: saveEditedPost
};
