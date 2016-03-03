var redis = require('redis');
// module.exports = redis.createClient(process.env.REDIS_URL);
module.exports = function (type) {
    var redis = require('redis');
    var client = redis.createClient(process.env.REDIS_URL);
    if(type === 'tape') {
        client.select(10);
    }
    else if (type === 'users'){
        client.select(0);
    }
    else if (type === 'blog'){
        client.select(1);
    }
    return client;
};
