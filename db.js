



var mongodb = require('mongodb'),
	Server = mongodb.Server,
    Db = mongodb.Db;

var setting = require('./setting');

var server = new Server( setting.DB.IP , setting.DB.PORT, {auto_reconnect: true});
var db = new Db(setting.DB.Database , server);
var dbclient = null;

db.connect = function(callBack){	
	db.open(function(err, db_client) {
	  if(err) throw err;
	  console.log("We are connected to MongoDB");    
	  dbclient = db_client;    
	  dbclient.authenticate(setting.DB.USERNAME , setting.DB.PASSWORD , function(err, p_client) {    
	      if (err) throw err;      
	      db.createCollection('board', function(err, collection) {
	        callBack();      
	      });          
	  });  
	});
}

module.exports = db;