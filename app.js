
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
        console.log("id:" + id);
        if(id !== undefined && id.length > 0){          
          db.collection('board', function(err, collection) { 
            var BSON = mongodb.BSONPure;
            var o_id = new BSON.ObjectID(id);
            collection.find({"_id" : o_id}).toArray(function(err, items) {              
              res.render('edit', {                
                data : items[0]
              });                                       
            });                        
          }); 
        }        
        else{
          res.render('edit', {
              id : id
          });  
        }            
        
  });  

  app.get('*', function(req, res){                              
      var requestPath = req.params[0].substring(1);
          extensionName = requestPath.substring(requestPath.lastIndexOf(".")+1 , requestPath.length);      

      console.log('request: ' + requestPath);      

      if(requestPath == "list"){
        var message = "";
        message += "this is a list : <br/>";        
        db.collection('board', function(err, collection) {              
            collection.find().sort({time:-1}).toArray(function(err, items) {
              res.render('list', {
                data : items
              });              
            });            
        });        
      }      
      else{
        var message = "";
        message += "Can`t find the file : " + requestPath +"  ";          
        res.send(message);              
      }
  });


  app.post('/add', function(req, res){                                 
        var author  = req.body.author,
            title   = req.body.title,
            lyric   = req.body.lyric,
            createTime = new Date().getTime();

        if(title === undefined || title.length < 1){
          res.send({ "errCode" : "1" , "msg" : "請輸入歌曲名稱" });
        }

        db.collection('board', function(err, collection) {              
            collection.insert({
                author : author,                
                title : title , 
                lyric : lyric,
                createTime : createTime,
            }, function(err, data) {
                if(err){
                  res.send({ "errCode" : "2" , "msg" : "資料庫存取失敗" });
                }
                  res.send({ "errCode" : "0" , "msg" : "OK" });
            });
        });        

  });

  app.post('/update/:id', function(req, res){          
        var id      = req.params.id,
            author  = req.body.author,
            title   = req.body.title,
            lyric   = req.body.lyric,
            modifyTime = new Date().getTime();


        if(title === undefined || title.length < 1){
          res.send({ "errCode" : "1" , "msg" : "請輸入歌曲名稱" });
        }
        else{
          console.log(JSON.stringify(req.body));
          console.log(id);
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
                    modifyTime : modifyTime,
                  }
              }, 
              {safe:true},
              function(err, result) {                  
                  console.log(result);
                  if(err){
                    res.send({ "errCode" : "2" , "msg" : "資料庫存取失敗" });
                  }
                  else
                    res.send({ "errCode" : "0" , "msg" : "OK" });
              });
          }); 
        }
        
  });

  app.post('/delete', function(req, res){          
    res.send("this is delete");
  }); 

  app.post('/dropTable', function(req, res){          
    res.send("this is dropTable");
  });                 
  
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







