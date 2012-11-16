
var db = global.db;

var dbHelper = require('../dbHelper'),
    utility = require('../utility'),
	  mongodb = require('mongodb');


//Check Owner
var isOwner = function(id , user , success , failure){  

  if(user == undefined){    
    failure();
    return;
  }

  dbHelper.getSongDataByID(id , function(data){
    var editor = data.editor;        
    if(editor == user){      
      success();
    }else{      
      failure();
    }
  });
}


var songListGetEditorName = function(data , callback){  
  //Cache editorName 
  var editorMap = {};  
  var loopFunction = function(i , data){
    if(i < 0){      
      return utility.callBackHandler(data , callback);
    }
    if(editorMap[data[i].editor] == null){
      getEditorName(data[i].editor , function(editorName){
        data[i].editorName = editorName;
        editorMap[data[i].editor] = editorName;
        loopFunction(--i , data);
      });
    }
    else{
      data[i].editorName = editorMap[data[i].editor];
      loopFunction(--i , data);
    }    
  }
  loopFunction(data.length-1 , data);
  
}

//Get Editor`s name
var getEditorName = function(id , callback){  
  dbHelper.getUserDataByFBID(id , function(profile){
    if(profile != undefined){        
        if(profile.isAnonymous)
          return utility.callBackHandler("匿名" , callback);
        else               
          return utility.callBackHandler( profile.displayName , callback);
    }
      return utility.callBackHandler("匿名" , callback);
  });    
}

exports.index = function(req, res , next){                              
  	var requestPath = req.params[0].substring(1);
    extensionName = requestPath.substring(requestPath.lastIndexOf(".")+1 , requestPath.length);        	
  	next();     
}

exports.edit = function(req, res){	
	var id = req.params.id;

  if(id === undefined && req.user !== undefined){
    res.render('edit', {      
          data : {}
    });
    return;
  }  
  isOwner(id , req.user , 
    function(){
      dbHelper.getSongDataByID(id , function(data){
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
	dbHelper.getSongDataByID(id , function(data){
    getEditorName(data.editor , function(editorName){
      data.editorName = editorName;
      res.render('query', {
        user : req.user,     
        data : data
      });       
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
            songListGetEditorName(items ,function(modifiedtItems){
              res.render('list', {
              user : req.user,
              data : modifiedtItems,
              keyword : keyword,
              type : type,
              });
            });	        	
	      	});            
		});
	}
	else{
  		db.collection('board', function(err, collection) {              
	      	collection.find().sort({time:-1}).toArray(function(err, items) {
            songListGetEditorName(items ,function(modifiedtItems){
  		        res.render('list', {
                user : req.user,
  		          data : modifiedtItems,
  		          keyword : null,
  		          type : null,
  		        });
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
        }, 
        {safe : true},
        function(err, data) {
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
      	{safe:true}, 
      	function(err, result) {            
        	res.send({ "errCode" : "0" , "msg" : "OK" , "obj" : result});
      	});
  	});
   };

  isOwner(id , req.user , deleteFunction , function(){
      res.send({ "errCode" : "1" , "msg" : "沒有存取權限" });
  });
}

