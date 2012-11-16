
var listOperation = (function(o){

	o.search = function(){		
		var type = $("#searchType").val();
			keyword = $("#searchInput").val();
		window.location.href = "/list?keyword=" + keyword + "&type=" + type;
	}


	o.openUserSetting = function(){		
		if($("#userSetting").length < 1){
			$.get("/user/query/" , function(data){			
				var $el = $(data);
				$("body").append($el);			
				$el.css({
					left : (document.documentElement.clientWidth - $el.width()) / 2,
				});
				userSetting.init();	
			});			
		}
	}

	return o;
})(listOperation || {});



