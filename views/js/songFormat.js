




window.songFormatCompiler = function(sourceCode){		
	var htmlOutputArray = new Array();
	var textArray = sourceCode.split("\n");
	var chordString , lyricString , parseChord , chord , chordDuration;
	var lineOrigin = [] , lineOutput = [] , lineText;
	for(var i = 0 ; i < textArray.length ; i++){
		if(textArray[i].length < 1){
			htmlOutputArray.push('<div class="line">&nbsp;</div>');
		}
		else{
			lineText = textArray[i];				
			lineOrigin = lineText.split(/\[(\S+)\]/gi);
			//ignore the first empty
			lineOutput = [];
			if(lineOrigin.length > 1){
				for(var j=1; j < lineOrigin.length ; j+=2){
					chordString = lineOrigin[j];
					lyricString = lineOrigin[j+1];
					parseChord = chordString.split(":");
					chord = parseChord[0] || "";
					chordDuration = parseChord[1] || "";
					lineOutput.push("<span class='bar'><span class='chord'>"+ chord + "<span class='chordDuration'>X" + chordDuration + "</span></span>" + lyricString + "</span>");
				}
			}
			else{
				console.log(lineOrigin[0]);
				lineOutput.push("<span class='bar'>" + lineOrigin[0] + "</span>");
			}
			htmlOutputArray.push('<div class="line">' + lineOutput.join("") + '</div>');
		}			
	}		

	return htmlOutputArray.join("");
}