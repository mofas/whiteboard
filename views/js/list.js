
var listOperation = (function(o){

	o.search = function(){		
		var type = $("#searchType").val();
			keyword = $("#searchInput").val();
		window.location.href = "/list?keyword=" + keyword + "&type=" + type;
	}

	return o;
})(listOperation || {});



