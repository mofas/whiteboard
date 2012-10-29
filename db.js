



var mongodb = require('mongodb'),
	Server = mongodb.Server,
    Db = mongodb.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('exampleDb', server);
db.open(function(err, db) {
  if(!err) {
    console.log("We are connected to MongoDB");
    db.createCollection('board', function(err, collection) {});
  }
  else{
    console.log(err);
  }  
});


module.exports = db;