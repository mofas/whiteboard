



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

}