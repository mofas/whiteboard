
var db = global.db;
var utility = require('../dbHelper'),
	mongodb = require('mongodb');


var isOwner = function(id , user , success , failure){  

  if(user == undefined){    
    failure();
    return;
  }

  utility.getSongDataByID(id , function(data){
    var editor = data.editor;        
    if(editor == user){      
      success();
    }else{      
      failure();
    }
  });
}

exports.index = function(req, res , next){                              
  	var requestPath = req.params[0].substring(1);
    extensionName = requestPath.substring(requestPath.lastIndexOf(".")+1 , requestPath.length);      
  	console.log('request: ' + requestPath); 
  	next();     
}

exports.edit = function(req, res){	
	var id = req.params.id;

  isOwner(id , req.user , 
    function(){
      utility.getSongDataByID(id , function(data){
        res.render('edit', {      
          data : data
        });       
      });
    },
    function(){
      res.send({ "errCode" : "1" , "msg" : "沒有存取權限" });  
    });   	
}

exports.query = function(req, res){
	var id = req.params.id; 
	utility.getSongDataByID(id , function(data){
	  res.render('query', {
      user : req.user,     
	    data : data
	  });       
	});    
}

exports.list = function(req, res){ 
	var     type = req.query.type,
   		 keyword = req.query.keyword,
    	queryRex = new RegExp(keyword , "g"),
     	query;

	if(keyword !== undefined){
	  	if(type == 'byAuth')        
		    query = { author : queryRex };
		else
		    query = { title : queryRex };		

		db.collection('board', function(err, collection) {              
	      	collection.find(query).sort({time:-1}).toArray(function(err, items) {
	        	res.render('list', {
              user : req.user,
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
              user : req.user,
		          data : items,
		          keyword : null,
		          type : null,
		        });              
	      	});            
  		});
	}   
}

exports.add = function(req, res){                                 
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
            editor : req.user,
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
}

exports.update = function(req, res){          
    var id      = req.params.id,
        author  = req.body.author,
        title   = req.body.title,
        lyric   = req.body.lyric,
        modifyTime = new Date().getTime(),
        limit = 40,
        summary;


    var updateFunction = function(){      
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
                    editor : req.user,
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
    };

    isOwner(id , req.user , updateFunction , function(){
        res.send({ "errCode" : "1" , "msg" : "沒有存取權限" });
    });
}

exports.delete = function(req, res){

  var id      = req.params.id, BSNO , o_id;
  
  
  var deleteFunction = function(){
   	db.collection('board', function(err, collection) {          
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
   };

  isOwner(id , req.user , deleteFunction , function(){
      res.send({ "errCode" : "1" , "msg" : "沒有存取權限" });
  });
}


exports.dropTable = function(req, res){          
	res.send("this is dropTable");
}