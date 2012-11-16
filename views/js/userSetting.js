var userSetting = (function(o){

	var $el , $submitButton , $closeButton;
	var processFlag = false;

	o.init = function(){
		$el = $("#userSetting");
		$submitButton = $el.find(".submitButton");
		$closeButton = $el.find(".closeButton");
		bindEvent();
	}

	var bindEvent = function(){
		$submitButton.on("click" , function(){
			if(processFlag)
				return;
			processFlag = true;
			var isAnonymous = ($el.find("#isAnonymous").attr('checked')) ? true : false;
			var displayName = $el.find("#inputDisplayName").val();
			var params = { isAnonymous: isAnonymous , displayName : displayName};
			$.post("/user/update" , params , function(data){
				processFlag = false;
				alert(data.msg);
			});
		});

		$closeButton.on("click" , function(){
			$el.remove();
		});
	}	

	return o;

})( userSetting || {} );