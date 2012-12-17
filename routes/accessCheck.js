

var accessCheck = function(req, res , next){	
	var path = req.route.path;
	var canAccess = false;

	if(req.user == null){
		canAccess = false;
	}
	else{
		//temporary hard code all access role
		var role = req.user.role;		
		if(path == "/add" || path == "/edit/:id?" || path == "/update/:id" || path == "/delete/:id"){
			if(role > 0)
				canAccess = true;
		}
		else if(path == "/admin/userList" || path == "/admin/adjustUserRole"){
			if(role > 4)
				canAccess = true;
		}
		else{
			canAccess = true;
		}		
	}

	if(path == "/query/:id?"){
		canAccess = true;
	}

	if(canAccess){
		next();
	}			
	else{
		res.redirect('/accessDenial.html');
	}
}

module.exports = accessCheck;