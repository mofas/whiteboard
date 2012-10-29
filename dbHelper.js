
var mongodb = require('mongodb');
var utility = require('./utility');


module.exports = {

  getSongDataByID :  function(id , callback){
    console.log(this);
    if(id !== undefined && id.length > 0){          
      db.collection('board', function(err, collection) { 
        var BSON = mongodb.BSONPure;
        var o_id = new BSON.ObjectID(id);
        collection.find({"_id" : o_id}).toArray(function(err, items) {                      
          return utility.callBackHandler(items[0] , callback);
        });
      }); 
    }        
    else{
      return utility.callBackHandler({} , callback);
    }
  },

}