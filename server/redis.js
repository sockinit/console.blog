var redis = require('redis');
var client = redis.createClient();
module.exports = client;

// module.exports = function(url){
//     return redis.createClient(url);
// };
