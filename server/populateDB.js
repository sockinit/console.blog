var client = require('./client.js')('users');

(function init() {
    console.log('populating DB');
    client.sadd('users',
        JSON.stringify({username: 'ivan', password: '$2a$08$OA3Eidr7fkq7oobrbDOZ5eXHGMGprcMJoxLXV9Kcxhf/HyQCGuRB2'}),
        JSON.stringify({username: 'tom', password: '$2a$08$Krn4y6FzCrdmRR26b2haO.PkO84PiG.LM7SogY4XdUQTNTjprXO/u'}),
        JSON.stringify({username: 'virginia', password: '$2a$08$yzDQiMSItJr/62InGearHeFy1IBo2BLXsQtKM5hqQKqjJ9GcvJgd.'}),
        JSON.stringify({username: 'jack', password: '$2a$08$u/9WsZcYA1VapdBzC1H3b.JrasR6gsJF6bQiOGAn0sAnl7CFqgmGe'}), function(err) {
            if (err) {
                console.log(err);
            }
        });
})();
