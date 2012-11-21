
/**
SongModel = [ line , line , line , ...];
line = [bar , bar , bar , ...]
bar = { chord , lyric }
chord = { chordName , chordDuration }
lyric = "String"
**/

var songFormatCompiler = (function(o){

	var  _sourceCode="" , _songModel = [];

	var modelIsChange = false;


	var trimSongModel = function(){		
		if(_songModel.length === 0)
			return;

		var frist = _songModel[0];
		while(frist === null && _songModel.length > 0){
			_songModel.splice(0,1);
			frist = _songModel[0];
		}

		var last = _songModel[_songModel.length-1];		
		while(last === null && _songModel.length > 0){
			_songModel.splice(_songModel.length-1,1);
			last = _songModel[_songModel.length-1];
		}		
	}

	o.setObjByPlainLyric = function(plainLyric){
		o.setObjBySourceCode(plainLyric);
	}

	o.setObjBySourceCode = function(sourceCode){
		_sourceCode = sourceCode;

		var songModel = new Array();
		var textArray = sourceCode.split("\n");
		var chordString , lyricString , parseChord , chordName , chordDuration;
		var lineOrigin = [] , lineArray = [] , lineText;

		var chordObj , bar;

		for(var i = 0 ; i < textArray.length ; i++){
			if(textArray[i].length < 1){
				songModel.push(null);
			}
			else{
				lineText = textArray[i];
				lineText = lineText.replace(/\]\s*\[/g , "] [");

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
				songModel.push(lineArray);
			}			
		}

		_songModel = songModel;
		trimSongModel();
	}

	o.getSourceCode = function(){
		if(modelIsChange){
			o.refreshSourceCodeByModel();
		}
		return _sourceCode;
	}


	o.refreshSourceCodeByModel = function(){
		var lineOutput , outputArray = [];
		var songModel = _songModel;
		var songLength = songModel.length;
		var lineLength ;
		var line , bar;
		var chord , chordName , chordDuration , lyric;
		for(var i = 0; i < songLength ; i++){
			if(songModel[i] === null ){
				lineLength = 0;
			}				
			else{
				lineLength = songModel[i].length;
			}			
			line = songModel[i];
			lineOutput = [];
			if(line === null){
				outputArray.push('\n');
			}
			else{
				for(var j = 0; j < lineLength ; j++){					
					bar = line[j];					
					chord = bar.chord;
					lyric = bar.lyric;					
					if(chord === undefined || chord === null || chord.chordName === null){
						lineOutput.push(lyric);
					}
					else{
						lineOutput.push("["+ chord.chordName + ":" + chord.chordDuration + "]" + lyric );	
					}				
				}
				outputArray.push(lineOutput.join(""));
			}			
		}		
		_sourceCode = outputArray.join("\n");
		modelIsChange = false;
	}

	o.getPlainLyric = function(){
		var songModel = _songModel;
		if(songModel.length === 0){
			return "";
		}

		var songLength = songModel.length;		
		var lineLength;
		var line , bar , lineOutput;
		var outputArray = [];

		for(var i = 0; i < songLength ; i++){
			if(songModel[i] === null ){
				lineLength = 0;
			}				
			else{
				lineLength = songModel[i].length;
			}
				
			line = songModel[i];
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


	o.updateLyric = function(plainLyric){				
		var textArray = plainLyric.split("\n");
		var textLine ;

		var songLength = _songModel.length;
		var line , bar;
		var lineLength , originLyric;
		var isLastBar = false;
		for(var i = 0 ; i < songLength ; i++){
			if(i >= textArray.length)
				textLine = "";
			else
				textLine = textArray[i];

			line = _songModel[i];			
			if(line !== null && line.length > 0){
				lineLength = line.length;
				isLastBar = false;
				for(var j = 0 ; j < lineLength ; j++){
					bar = line[j];

					if(j === lineLength-1){
						isLastBar = true;						
					}						
					//last bar in line
					if(isLastBar){												
						bar.lyric = textLine;						
					}
					else{						
						originLyric = bar.lyric;						
						if(textLine === null){
							bar.lyric = "";
						}
						else if(originLyric !== null && originLyric.length > textLine.length){
							bar.lyric = textLine;							
							textLine = "";
						}
						else{							
							bar.lyric = textLine.substring(0 , originLyric.length);							
							textLine = textLine.substring(originLyric.length);
						}
					}					
				}
			}
			else{				
				if(textLine === ""){
					_songModel[i] = null;
				}					
				else{
					_songModel[i] = [{ "chord" : null , "lyric" : textLine }];
				}
					
			}
		}
		
		if(textArray.length > songLength){
			var diff = textArray.length - songLength + 1;
			for(var i =0 ; i < diff-1 ; i++){				
				_songModel.push([{ "chord" : null , "lyric" : textArray[songLength+i] }]);
			}			
		}		

		modelIsChange = true;
		trimSongModel();
	}


	o.getoutputFormat = function(){
		var lineOutput , outputArray = [];
		var songModel = _songModel;
		var songLength = songModel.length;
		var lineLength ;
		var line , bar;
		var chord , chordName , chordDuration , lyric;
		for(var i = 0; i < songLength ; i++){
			if(songModel[i] === null ){
				lineLength = 0;
			}				
			else{
				lineLength = songModel[i].length;
			}			
			line = songModel[i];
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


	o.getSongModel = function(){
		return _songModel;
	}
	

	return o;

})( songFormatCompiler || {} );

