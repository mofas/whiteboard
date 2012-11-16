
var mongodb = require('mongodb');
var utility = require('./utility');


module.exports = {

  getSongDataByID :  function(id , callback){    
    if(id !== undefined && id.length > 0){          
      global.db.collection('board', function(err, collection) { 
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


  userLoginUpsert: function(profile , done){
    global.db.collection('user', function(err, collection) {
        collection.find({"FB_id" : profile.id}).toArray(function(err, items) {          
          if(items.length < 1){
            //INSERT             
            collection.insert({
              FB_id : profile.id,
              username : profile.username,                
              displayName : profile.displayName, 
              createTime : new Date().getTime(), 
              lastLoginTime : new Date().getTime(), 
              role : 0,
              isAnonymous : false,
            },
            {safe: true},
            function(err, data) {
              done(null, {id: profile.id , username : profile.username , displayName : profile.displayName});    
            });
          }
          else{
            //UPDATE            
            collection.update({
              "FB_id" : profile.id
            },
            {
                $set:{
                  lastLoginTime : new Date().getTime()
                }
            }, 
            {safe:true},
            function(err, data) {
              done(null, {id: profile.id , username : profile.username , displayName : profile.displayName});    
            });
          }          
        });
    });
  },

  getUserDataByFBID : function(id , callback){
    if(id !== undefined && id.length > 0){          
      global.db.collection('user', function(err, collection) {         
        collection.find({"FB_id" : id}).toArray(function(err, items) {                      
          return utility.callBackHandler(items[0] , callback);
        });
      }); 
    }        
    else{
      return utility.callBackHandler({} , callback);
    }
  }


}