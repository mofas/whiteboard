

$(document).ready(function() {
	query.init();	
});



var query = (function(o){

	var $textarea , $htmlarea;

	o.init = function(){
		$textarea = $("#rawLyric");
		$htmlarea = $("#lyric");
		convertReturnLine();
	}


	var convertReturnLine = function(){		
		var sourceCode = $textarea.val();
		songFormatCompiler.setObjBySourceCode(sourceCode);		
		$htmlarea.addClass("songFormat").html(songFormatCompiler.getoutputFormat());		
	}

	return o;
})( query || {} );