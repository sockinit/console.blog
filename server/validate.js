// 'use strict';
//
//
// // jack = upperclass // '$2a$08$u/9WsZcYA1VapdBzC1H3b.JrasR6gsJF6bQiOGAn0sAnl7CFqgmGe'
// // top = lowerclass '$2a$08$Krn4y6FzCrdmRR26b2haO.PkO84PiG.LM7SogY4XdUQTNTjprXO/u'
// // ivan  = oranges '$2a$08$OA3Eidr7fkq7oobrbDOZ5eXHGMGprcMJoxLXV9Kcxhf/HyQCGuRB2'
// // virginia = virginia '$2a$08$yzDQiMSItJr/62InGearHeFy1IBo2BLXsQtKM5hqQKqjJ9GcvJgd.'
//
// var Bcrypt = require('bcrypt');
// var Hapi   = require('hapi');
// var Basic  = require('hapi-auth-basic');
//
// var server = new Hapi.Server();
//
// server.connection({ port: 3000});
//
// // Note: the password is: "pw"
// var users = {
//     rob: {
//         username: 'rob',
//         password: '$2a$08$u/9WsZcYA1VapdBzC1H3b.JrasR6gsJF6bQiOGAn0sAnl7CFqgmGe',
//         name: 'robert',
//         id: 1
//     }
// };
// Bcrypt.hash('virginia', 8, function(err, hash) {
//     console.log(hash);
// });
//
// var validate = function (request, username, password, callback) {
//     var user = users[username];
//     //if (!user) { return callback ( null, false ); }
//     Bcrypt.compare('upperclass', user.password, function(err, isValid) {
//         console.log(isValid);
//         //callback(err, isValid, { id: user.id, name: user.name});
//     });
// };
// validate(null, 'rob');
//
// server.register( Basic, function (err) {
//     server.auth.strategy('simple', 'basic', {validateFunc: validate});
//     server.route ({
//         method: 'get',
//         path: '/',
//         config: {
//             auth: 'simple',
//             handler: function (request, reply) {
//                 reply ('hello ' + request.auth.credentials.name);
//             }
//         }
//     });
//
//     server.start( function () {
//         console.log('server is running at: ', server.info.uri);
//     });
// });
