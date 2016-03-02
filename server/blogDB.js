var client = require('./client.js');

function addToDB(client, postObj, callback) {
    client.rpush('posts', postObj, function(err, reply) {
        if (err) { console.log(err); }
        else { callback(reply); }
    });
}

function retrieveBlogs(client, callback){
    client.LRANGE('posts', 0, -1, function(err, reply){
        if(err){
            console.log(err);
        } else {
            callback(reply);
        }
    });
}

module.exports = {
    addToDB : addToDB,
    retrieveBlogs: retrieveBlogs
};
