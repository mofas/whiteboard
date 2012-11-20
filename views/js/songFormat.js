
/**
SongObj = [ line , line , line , ...];
line = [bar , bar , bar , ...]
bar = { chord , lyric }
chord = { chordName , chordDuration }
lyric = "String"
**/

var songFormatCompiler = (function(o){

	var  _sourceCode="" , _songObj = {};

	o.setObjByPlainLyric = function(plainLyric){
		o.setObjBySourceCode(plainLyric);
	}

	o.setObjBySourceCode = function(sourceCode){
		_sourceCode = sourceCode;

		var tempObj = new Array();
		var textArray = sourceCode.split("\n");
		var chordString , lyricString , parseChord , chordName , chordDuration;
		var lineOrigin = [] , lineArray = [] , lineText;

		var chordObj , bar;

		for(var i = 0 ; i < textArray.length ; i++){
			if(textArray[i].length < 1){
				tempObj.push({"line" : null});
			}
			else{
				lineText = textArray[i];				
				lineOrigin = lineText.split(/\[(\S+)\]/gi);				
				lineArray = [];
				if(lineOrigin.length > 1){
					for(var j=1; j < lineOrigin.length ; j+=2){
						chordString = lineOrigin[j];
						lyricString = lineOrigin[j+1];

						parseChord = chordString.split(":");
						chordName = parseChord[0] || "";
						chordDuration = parseChord[1] || "";

						chordObj = {"chordName" : chordName , "chordDuration" : chordDuration};
						bar = { "chord" : chordObj , "lyric" : lyricString }
						lineArray.push(bar);
					}
				}
				else{
					bar = { "chord" : null , "lyric" : lineOrigin[0] };
					lineArray.push(bar);
				}
				tempObj.push(lineArray);
			}			
		}		
		_songObj = tempObj;
	}

	o.getSourceCode = function(){
		return _sourceCode;
	}

	o.getPlainLyric = function(){
		var songObj = _songObj;
		if(songObj.length === 0){
			return "";
		}

		var songLength = songObj.length;		
		var lineLength;
		var line , bar , lineOutput;
		var outputArray = [];

		for(var i = 0; i < songLength ; i++){
			lineLength = songObj[i].length;
			line = songObj[i];
			lineOutput = [];
			if(line === null){
				outputArray.push('\n');
			}
			else{
				for(var j = 0; j < lineLength ; j++){
					bar = line[j];					
					lyric = bar.lyric;					
					lineOutput.push(lyric);					
				}
				outputArray.push(lineOutput.join(""));
			}			
		}
		return outputArray.join("\n");
	}


	o.getoutputFormat = function(){
		var lineOutput , outputArray = [];
		var songObj = _songObj;
		var songLength = songObj.length;
		var lineLength ;
		var line , bar;
		var chord , chordName , chordDuration , lyric;
		for(var i = 0; i < songLength ; i++){
			lineLength = songObj[i].length;
			line = songObj[i];
			lineOutput = [];
			if(line === null){
				outputArray.push('<div class="line">&nbsp;</div>');
			}
			else{
				for(var j = 0; j < lineLength ; j++){					
					bar = line[j];					
					chord = bar.chord;
					lyric = bar.lyric;					
					if(chord === undefined || chord === null || chord.chordName === null){
						lineOutput.push("<span class='bar'>" + lyric + "</span>");
					}
					else{
						lineOutput.push("<span class='bar'><span class='chord'>"+ chord.chordName + "<span class='chordDuration'>X" + chord.chordDuration + "</span></span>" + lyric + "</span>");	
					}				
				}
				outputArray.push('<div class="line">' + lineOutput.join("") + "</div>");
			}			
		}
		return outputArray.join("");
	}


	o.getSongObj = function(){
		return _songObj;
	}
	

	return o;

})( songFormatCompiler || {} );

