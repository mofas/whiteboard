/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
(function($) {
  var o = $({});
  $.subscribe = function() {
    o.on.apply(o, arguments);
  };
  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };
  $.publish = function() {
    o.trigger.apply(o, arguments);
  };
}(jQuery));


$(document).ready(function() {
	query.init();	
});



var query = (function(o){

	var $textarea , $htmlarea;

	var initByChordNoteInputData = function(){		
		var param = $("#chordNoteData").val(), 
			chordName,
			collection,
			strArray,
			intArray,
			diagramArray,
			noteInfo;		

		collection = param.split("&").slice(1);
		for(var i =0; i < collection.length ;i++){
			chordName = decodeURIComponent(collection[i].split("=")[0]);
			strArray = collection[i].split("=")[1];
			intArray = new Array();
			for(var j=0;j < strArray.length;j++){
				var index = isNaN(parseInt(strArray[j] , 10)) ? -1 : parseInt(strArray[j] , 10);								
				intArray.push(index);				
			}		
			console.log(chordName , intArray);
			canvas_chord_diagram.setFingerIndex(chordName , intArray);
			chord_collection.add(chordName , canvas_chord_diagram.getCanvas() , intArray.slice());
			
		}		
		var outputCanvas = chord_collection.outputCollectionImage();
		$("#chordNote").html(outputCanvas);
	}

	o.init = function(){
		$textarea = $("#rawLyric");
		$htmlarea = $("#lyric");
		convertReturnLine();
		initByChordNoteInputData();
	}


	var convertReturnLine = function(){		
		var sourceCode = $textarea.val();
		songFormatCompiler.setObjBySourceCode(sourceCode);		
		$htmlarea.addClass("songFormat").html(songFormatCompiler.getoutputFormat());		
	}

	return o;
})( query || {} );