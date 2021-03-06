

module.exports = function(setting){

	var mongodb = require('mongodb'),
	Server = mongodb.Server,
    Db = mongodb.Db;
	
	var server = new Server( setting.DB.IP , setting.DB.PORT, {auto_reconnect: true});
	var db = new Db(setting.DB.Database , server);
	var dbclient = null;

	db.connect = function(callBack){	
		db.open(function(err, db_client) {
		  if(err) throw err;
		  console.log("Connected to MongoDB");    
		  dbclient = db_client;    
		  dbclient.authenticate(setting.DB.USERNAME , setting.DB.PASSWORD , function(err, p_client) {    
		      if (err) throw err;      
		      db.createCollection('board', function(err, collection) {});
		      db.createCollection('user', function(err, collection) {});
		      callBack();
		  });  
		});
	}

	return db;
}