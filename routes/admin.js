



exports.userList = function(req, res){
	db.collection('user', function(err, collection) {              
      	collection.find().sort({createTime:-1}).limit(10).toArray(function(err, items) {
          res.render('userList', {
          user : req.user,
          data : items,          
          });
      	});            
	});
}


exports.adjustUserRole = function(req, res){
	var targetUserFBID = req.body.userFBID;
	var toRole = req.body.toRole;	
	db.collection('user', function(err, collection) {              
      	collection.update( 
		{
			"FB_id" : targetUserFBID
		},
		{
		  $set:{                    
		    role : toRole
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