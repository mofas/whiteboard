



var mongodb = require('mongodb'),
	Server = mongodb.Server,
    Db = mongodb.Db;

/**
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
**/

var server = new Server('alex.mongohq.com', 10064, {auto_reconnect: true});
var db = new Db('app7698594', server);
var dbclient = null;

db.connect = function(callBack){	
	db.open(function(err, db_client) {
	  if(err) throw err;
	  console.log("We are connected to MongoDB");    
	  dbclient = db_client;    
	  dbclient.authenticate('mofas223', 'qqww1122', function(err, p_client) {    
	      if (err) throw err;      
	      db.createCollection('board', function(err, collection) {
	        callBack();      
	      });          
	  });  
	});
}

module.exports = db;