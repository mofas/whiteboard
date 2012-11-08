

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
		var text = $textarea.val();
		var htmlOutputArray = new Array();
		var textArray = text.split("\n");		
		for(var i = 0 ; i < textArray.length ; i++){
			if(textArray[i].length < 1){
				htmlOutputArray.push('<div class="line">&nbsp;</div>');
			}
			else{
				htmlOutputArray.push('<div class="line">' + textArray[i] + '</div>');
			}			
		}

		$htmlarea.html(htmlOutputArray.join(""));
	}

	return o;
})( query || {} );