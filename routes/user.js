

exports.query = function(req ,res){	
	res.render('user', {
    	user : req.user
    });	
}


exports.update = function(req ,res){
	var isAnonymous = req.body.isAnonymous;
	var displayName = req.body.displayName;
	
	global.db.collection('user', function(err, collection) {
        collection.find({"FB_id" : req.user.FB_id}).toArray(function(err, items) {
        	if(err){
            	res.send({"errCode" : "1" , "msg" : "資料庫讀取失敗"});
            	return;
            }
        	collection.update({
              "FB_id" : req.user.FB_id
            },
            {
                $set:{
                  isAnonymous : (isAnonymous === 'true'),
                  displayName : displayName
                }
            }, 
            {safe:true},
            function(err, data) {
            	if(err)
            		res.send({"errCode" : "1" , "msg" : "更新失敗"});
            	else
              		res.send({ "errCode" : "0" , "msg" : "更新成功" });
            });          
        });	
    });	
}