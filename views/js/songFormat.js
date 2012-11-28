
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
		var first ,
			last;
		if(_songModel.length === 0)
			return;

		first = _songModel[0];
		while(first === null && _songModel.length > 0){
			_songModel.splice(0,1);
			first = _songModel[0];
		}

		last = _songModel[_songModel.length-1];		
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

		var songModel = new Array() ,
			textArray = sourceCode.split("\n") ,
			chordString , 
			lyricString , 
			parseChord , 
			chordName , 
			chordDuration , 
			chordObj , 
			bar ,
			lineOrigin = [] ,
			lineArray = [] ,
			lineText;	

		for(var i = 0 ; i < textArray.length ; i++){
			if(textArray[i].length < 1){
				songModel.push(null);
			}
			else{
				lineText = textArray[i];
				lineText = lineText.replace(/\]\s*\[/g , "] [");				
				lineOrigin = lineText.split(/\[([a-zA-z0-9:]+?)\]/gi);				
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
		var lineOutput , 
			outputArray = [] ,
			songModel = _songModel ,
			songLength = songModel.length ,
			lineLength , 
			line , 
			bar,
			chord , 
			chordName , 
			chordDuration , 
			lyric;

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

		var	songLength = songModel.length ,
			lineLength ,
			line , bar , lineOutput ,
			outputArray = [];

		for(var i = 0; i < songLength ; i++){
			lineLength = (songModel[i] === null ) ? 0 : songModel[i].length;
				
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
		var textArray = plainLyric.split("\n") ,
			textLine ,
			songLength = _songModel.length ,			
			line , bar ,
			lineLength , originLyric ,
			isLastBar = false;

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


	//updateChordObj = [ line , line , line]
	//line = [bar , bar , bar ]
	//bar = {chordName  , chordDuration , chordPosition }
	//chordPosition represent the lyric length of this chord
	o.updateChord = function(updateChordObj){		
		if(updateChordObj === undefined || updateChordObj === null)
			return;		
		
		var updateChordObjLength = updateChordObj.length,
			lineLength;

		var line, 
			bar,
			chordName,
			chordDuration,
			chordPosition = 0;

		var songModelLine, 
			songModelBar,
			songMoelLength = _songModel.length,
			songModelLineLength,
			songModelLineLyric;

		var continLyricCharNo = 0,
			isLastBar = false;

		
		for(var i = 0 ; i < updateChordObjLength ; i++){
			
			line = updateChordObj[i];
			lineLength = line.length;						

			if(songMoelLength > i){				
				
				//update origin chord
				songModelLine = _songModel[i];
				songModelLineLength = songModelLine.length;				
				
				//retrieve whole lyric in this line
				songModelLineLyric = "";
				for(var k = 0 ; k < songModelLineLength ; k++){
					songModelLineLyric += songModelLine[k].lyric;
				}
				//if the frist bar is not at position 0 , insert a empty bar at first;
				if(line[0] !== undefined && line[0] !== null && line[0].chordPosition > 0){
					line.unshift(null);
					lineLength++;
				}				
				
				for(var j = 0 ; j < lineLength ; j++){
					isLastBar = false;
					if( j === (lineLength-1))
						isLastBar = true;

					bar = line[j];				
					if(bar !== undefined && bar !== null){
						chordName = bar.chordName || "";
						chordDuration = bar.chordDuration || "";
					}										
					//next position minus current position is the number of char this chord hold
					
					if(!isLastBar){
						if(j === 0)
							continLyricCharNo =  line[j+1].chordPosition - 0;
						else
							continLyricCharNo =  line[j+1].chordPosition - line[j].chordPosition;
					}

					if(songModelLineLength > j){
						//update bar
						songModelBar = songModelLine[j];
						if(bar !== undefined && bar !== null){						
							songModelBar.chord = { "chordName" : chordName , "chordDuration" : chordDuration };
						}
						else{
							songModelBar.chord = null;	
						}
						if(isLastBar){
							songModelBar.lyric = songModelLineLyric;							
						}
						else{
							if(songModelLineLyric.length > continLyricCharNo){
								songModelBar.lyric = songModelLineLyric.substring(0, continLyricCharNo);
								songModelLineLyric = songModelLineLyric.substring(continLyricCharNo);								
							}
							else{
								songModelBar.lyric = songModelLineLyric;
								songModelLineLyric = "";								
							}
						}						
					} 
					else{
						//insert new bar
						var newBar = {};
						newBar.chord = { "chordName" : chordName , "chordDuration" : chordDuration };
						if(isLastBar){
							newBar.lyric = songModelLineLyric;							
						}
						else{
							if(songModelLineLyric.length > continLyricCharNo){
								newBar.lyric = songModelLineLyric.substring(0, continLyricCharNo);
								songModelLineLyric = songModelLineLyric.substring(continLyricCharNo);								
							}
							else{
								newBar.lyric = songModelLineLyric;
								songModelLineLyric = "";								
							}
						}
						songModelLine.push(newBar);
					}

					//delete 
					if(isLastBar){
						songModelLine = songModelLine.slice(0 , j+1);
						_songModel[i] = songModelLine;						
					}
				}
				
			}
			else{
				//insert new line
				var newLine = [];				
				var newBar , chordObj;
				for(var j = 0 ; j < lineLength ; j++){
					bar = line[j];
					chordName = bar.chordName;
					chordDuration = bar.chordDuration;					

					chordObj = {"chordName" : chordName , "chordDuration" : chordDuration};					
					newBar = { chord : chordObj , lyric : "" };
					newLine.push(newBar);
				}
				_songModel.push(newLine);
			}

			//delete the unmention line Chord
			var modelLength = _songModel.length;

			if(updateChordObjLength < modelLength){
				for(var l = updateChordObjLength ; l < modelLength ; l++){					
					line = _songModel[l];
					if(line === null)
						lineLength = 0;
					else	
						lineLength = line.length
					for(var m = 0; m < lineLength ; m++){
						bar = line[m];
						bar.chord = null;
					}
				}
			}

			modelIsChange = true;
		}		
		
	}
	
	//out put format { chordName , chordDuration , chordPosition , chordLine }
	o.getChordObjArray = function(){
		var outputArray = [],
			songModel = _songModel,
			songLength = songModel.length,
			line,
			bar,
			chord,
			chordName, 
			chordDuration,
			chordPositionY = 0,
			chordPositionX = 0;

		for(var i = 0; i < songLength ; i++){
			lineLength = (songModel[i] === null ) ? 0 : songModel[i].length;
			line = songModel[i];
			lineOutput = [];
			if(line !== null){
				chordPositionY = i;
				chordPositionX = 0;
				for(var j = 0; j < lineLength ; j++){					
					bar = line[j];					
					chord = bar.chord;
					lyric = bar.lyric;					
					if(chord !== undefined && chord !== null && chord.chordName !== null){						
						outputArray.push({"chordName" : chord.chordName , "chordDuration" : chord.chordDuration , "chordLine" : chordPositionY , "chordPosition" : chordPositionX });
					}					
					chordPositionX += bar.lyric.length;
				}				
			}
		}			
		return outputArray;
	}


	o.getoutputFormat = function(){
		var lineOutput , outputArray = [] ,
			songModel = _songModel ,
			songLength = songModel.length ,
			lineLength ,
			line ,
			bar ,
			chord ,
			chordName ,
			chordDuration ,
			lyric,
			chordFragHtml;


		for(var i = 0; i < songLength ; i++){
			lineLength = (songModel[i] === null ) ? 0 : songModel[i].length;

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
						console.log(chord.chordDuration);
						if(chord.chordDuration === '1'){
							chordFragHtml = "<span class='chord'>"+ chord.chordName + "</span>";	
						}
						else{
							chordFragHtml = "<span class='chord'>"+ chord.chordName + "<span class='chordDuration'>X" + chord.chordDuration + "</span></span>";	
						}						
						lineOutput.push("<span class='bar'>" + chordFragHtml + lyric + "</span>");	
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

