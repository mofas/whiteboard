



var FB_API = (function(o){



	o.login = function(){
		FB.login(function(response) {
	   		if (response.authResponse) {
		    	console.log('Welcome!  Fetching your information.... ');
		     	FB.api('/me', function(response) {
		       		console.log(response);
		     	});
		   	} else {
		    	console.log('User cancelled login or did not fully authorize.');
		   	}
		 });
	}

	return o;


})( FB_API || {});




var listOperation = (function(o){

	o.search = function(){
		
	}


	return o;
})(listOperation || {});



