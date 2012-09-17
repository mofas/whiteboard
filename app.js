
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs   = require('fs')
  , mongodb = require('mongodb');  


/**********************************************
*  mongoDB
***********************************************/
var Server = mongodb.Server,
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



/********************************************************
**  router PathParse
*********************************************************/


var pathParse  = function(){


  app.get('/edit/:id?', function(req, res){
    var id = req.params.id;     
    getSongDataByID(id , function(data){
      res.render('edit', {      
        data : data
      });       
    });
    
  });

  app.get('/query/:id?', function(req, res){
    var id = req.params.id; 
    getSongDataByID(id , function(data){
      res.render('query', {      
        data : data
      });       
    });    
  });

  app.get('/list' , function(req, res){ 
    var   type = req.query.type,
       keyword = req.query.keyword,
        queryRex = new RegExp(keyword , "g"),
         query;

    if(keyword !== undefined){
      if(type == 'byAuth')        
        query = { author : queryRex };
      else
        query = { title : queryRex };

      console.log(query);

      db.collection('board', function(err, collection) {              
          collection.find(query).sort({time:-1}).toArray(function(err, items) {
            res.render('list', {
              data : items,
              keyword : keyword,
              type : type,
            });              
          });            
      });
    }
    else{
      db.collection('board', function(err, collection) {              
          collection.find().sort({time:-1}).toArray(function(err, items) {
            res.render('list', {
              data : items,
              keyword : null,
              type : null,
            });              
          });            
      });
    }   
  });

  app.get('*', function(req, res){                              
      var requestPath = req.params[0].substring(1);
          extensionName = requestPath.substring(requestPath.lastIndexOf(".")+1 , requestPath.length);      
      console.log('request: ' + requestPath);      
  });

  app.post('/add', function(req, res){                                 
        var author  = req.body.author,
            title   = req.body.title,
            lyric   = req.body.lyric,            
            createTime = new Date().getTime(),
            limit = 40,
            summary;

        if(lyric.length <= 40){
          limit = lyric.length;
        }
        var summary = lyric.substring(0 , limit);

        if(title === undefined || title.length < 1){
          res.send({ "errCode" : "1" , "msg" : "請輸入歌曲名稱" });
          return;
        }

        db.collection('board', function(err, collection) {              
            collection.insert({
                author : author,                
                title : title , 
                summary : summary, 
                lyric : lyric,
                createTime : createTime,
            }, function(err, data) {
                if(err){
                  res.send({ "errCode" : "2" , "msg" : "資料庫存取失敗" });
                }
                  res.send({ "errCode" : "0" , "msg" : "OK" , "obj" : data[0]});
            });
        });        

  });

  app.post('/update/:id', function(req, res){          
        var id      = req.params.id,
            author  = req.body.author,
            title   = req.body.title,
            lyric   = req.body.lyric,
            modifyTime = new Date().getTime(),
            limit = 40,
            summary;

        if(lyric.length <= 40){
          limit = lyric.length;
        }
        var summary = lyric.substring(0 , limit);        

        if(title === undefined || title.length < 1){
          res.send({ "errCode" : "1" , "msg" : "請輸入歌曲名稱" });
          return;
        }
        else{          
          var BSON = mongodb.BSONPure;
          var o_id = new BSON.ObjectID(id);

          db.collection('board', function(err, collection) {              
              collection.update( 
              {
                "_id" : o_id
              },
              {
                  $set:{
                    author : author,                
                    title : title , 
                    lyric : lyric,
                    summary: summary,
                    modifyTime : modifyTime,
                  }
              }, 
              {safe:true},
              function(err, result) {                                    
                  if(err){
                    res.send({ "errCode" : "2" , "msg" : "資料庫存取失敗" });
                  }
                  else
                    res.send({ "errCode" : "0" , "msg" : "OK" });
              });
          }); 
        }
        
  });

  app.post('/delete/:id', function(req, res){          
     db.collection('board', function(err, collection) {      
        var id      = req.params.id, BSNO , o_id;
        if(id.length < 1){
          res.send({"errCode" : "1" , "msg" : "id is NULL"});
          return;
        }

        BSON = mongodb.BSONPure;
        o_id = new BSON.ObjectID(id);        

        collection.remove(
          {
            "_id" : o_id
          }, 
          {
            safe:true
          }, 
          function(err, result) {            
            res.send({ "errCode" : "0" , "msg" : "OK" , "obj" : result});
        });
    });      
  }); 

  app.post('/dropTable', function(req, res){          
    res.send("this is dropTable");
  });                 
  
}

var getSongDataByID= function(id , callback){
  if(id !== undefined && id.length > 0){          
    db.collection('board', function(err, collection) { 
      var BSON = mongodb.BSONPure;
      var o_id = new BSON.ObjectID(id);
      collection.find({"_id" : o_id}).toArray(function(err, items) {                      
        return callBackHandler(items[0] , callback);
      });
    }); 
  }        
  else{
    return callBackHandler({} , callback);
  }       
}



/*******************************************************
**  Utility
********************************************************/
var callBackHandler = function(returnValue , callback){
  if (callback && typeof(callback) === "function") {  
      return callback(returnValue);  
  }
  else{
    return returnValue;
  } 
}


/**********************************************************
*   start server
***********************************************************/

var port = 3000;
var app = express();

app.configure(function(){  
  app.use(express.bodyParser());  
  app.use(express.static('views/'));
  app.set("view engine", "ejs");
});


pathParse();

app.listen(port);







