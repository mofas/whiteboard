
var setting = require('./setting');
var redis = require('redis');

var redisClient = require("redis").createClient(setting.Redis.PORT , setting.Redis.IP );

redisClient.auth(setting.Redis.PASSWORD , function(){
  console.log('Redis client connected');
});

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = redisClient;