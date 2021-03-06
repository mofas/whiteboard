
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

	var isFullWidthChar = function(c) {
        var tmp = escape(c);
        if (tmp.length == 1) {
                return false;
        }
        return (tmp.charAt(1) == 'u');
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
				//lineText = lineText.replace(/\]\s*\[/g , "] [");				
				lineOrigin = lineText.split(/\[([#ba-zA-z0-9:]+?)\]/gi);				
				lineArray = [];									
				if(lineOrigin.length > 1){	
					//if the first lineOrigin is lyric
					if(lineOrigin[0].length > 0){
						bar = { "chord" : null , "lyric" : lineOrigin[0] };
						lineArray.push(bar);						
					}
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
				outputArray.push('');
			}
			else{
				for(var j = 0; j < lineLength ; j++){					
					bar = line[j];					
					chord = bar.chord;
					lyric = bar.lyric;					
					if(chord == null || chord.chordName == null){
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
				outputArray.push('');
			}
			else{
				for(var j = 0; j < lineLength ; j++){
					bar = line[j];					
					lyric = bar.lyric;					
					lineOutput.push(lyric);					
				}
				if(lineOutput.length > 0){
					outputArray.push(lineOutput.join(""));	
				}								
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
		if(updateChordObj == null)
			return;		

		//get plain lyric and add chord.
		var plainLyric = o.getPlainLyric(),
			plainLyricLineArray = plainLyric.split("\n"),
			plainLyricLineArrayLength = plainLyricLineArray.length,
			newSongModel = [],

			updateChordObjLength = updateChordObj.length,
			chordObjLine,
			chordObjLineLength,
			chordObjbar,

			continLyricCharNo = 0,
			isLastBar = false,

			playinLyricLine = "",
			tempSongModel = [] , line , bar , chord , lyric,
			isLastBar = false,
			chordName , chordDuration , chordPosition;

		var getLyricByPosition = function(lyric , playinLyricLine, continLyricCharNo){
			if(playinLyricLine == null){
				return ["" , ""];
			}
			//offset the full-Width char position
			var lyricLength = playinLyricLine.length;
			var realCharNo = 0;
			var lyricCount = 0;
			while(continLyricCharNo > 0){
				var char = playinLyricLine.charAt(lyricCount);
				if(isFullWidthChar(char)){
					continLyricCharNo -= 2;					
				}
				else{
					continLyricCharNo -= 1;						
				}
				realCharNo++;
				lyricCount++;
				if(lyricCount > lyricLength){
					break;
				}					
			}			
			lyric = playinLyricLine.substring(0, realCharNo);
			playinLyricLine = playinLyricLine.substring(realCharNo);			
			return [lyric , playinLyricLine];
		}		

		for(var i = 0 ; i < updateChordObjLength ; i++){
			
			line = [];
			chordObjLine = updateChordObj[i];
			
			chordObjLineLength = chordObjLine.length;
			playinLyricLine = plainLyricLineArray[i] || "";			
			//if chordObjLine === null , insert a pure lyric line at first			
			if(chordObjLine == null || chordObjLine.length === 0){				
				bar = { "chord" : null , "lyric" : playinLyricLine };				
				line.push(bar);				
			}
			else{
				//if the frist bar is not at position 0 , insert a pure lyric bar at first			
				if(chordObjLine[0] != null && chordObjLine[0].chordPosition > 0){
					continLyricCharNo = chordObjLine[0].chordPosition;
					var getLyricByPositionObj = getLyricByPosition(lyric , playinLyricLine, continLyricCharNo);
					lyric = getLyricByPositionObj[0];
					playinLyricLine = getLyricByPositionObj[1];					
					bar = { "chord" : null , "lyric" : lyric };
					line.push(bar);
				}
				
				for(var j = 0; j < chordObjLineLength ; j++){
					chordObjbar = chordObjLine[j];						
					
					isLastBar = false;
					if( j === (chordObjLineLength-1)){
						isLastBar = true;
					}
					if(isLastBar){
						lyric = playinLyricLine;						
					}
					else{					
						//calculate how many 
						continLyricCharNo = chordObjLine[j+1].chordPosition - chordObjLine[j].chordPosition;
						//avoiding the chord is too dense.
						if(continLyricCharNo < (chordObjLine[j].chordName.length+1)){							
							continLyricCharNo = chordObjLine[j].chordName.length+1;
							chordObjLine[j+1].chordPosition += (chordObjLine[j].chordPosition + chordObjLine[j].chordName.length+1);
						}

						var getLyricByPositionObj = getLyricByPosition(lyric , playinLyricLine, continLyricCharNo);
							lyric = getLyricByPositionObj[0];
							playinLyricLine = getLyricByPositionObj[1];				
					}					
					if(chordObjbar == null || chordObjbar.chordName == null || chordObjbar.chordDuration == null){
						bar = { "chord" : null , "lyric" : lyric };						
						line.push(bar);
					}
					else{
						chord = {"chordName" : chordObjbar.chordName , "chordDuration" : chordObjbar.chordDuration };																		
						bar = { "chord" : chord , "lyric" : lyric };						
						line.push(bar);
					}
				}
			}			
			tempSongModel.push(line);
		}
		
		if(updateChordObjLength < plainLyricLineArrayLength ){
			for(var l = updateChordObjLength ; l < plainLyricLineArrayLength ; l++){
				lyric = plainLyricLineArray[l];				
				if(lyric !== null && lyric.length > 0){
					tempSongModel.push([{ "chord" : null , "lyric" : lyric }]);
				}
				else{
					tempSongModel.push([]);
				}				
			}
		}
		
		_songModel = tempSongModel;
		modelIsChange = true;		
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

		var getChordPosition = function(lyric){
			var totalXLength = 0;
			for(var i = 0 ; i < lyric.length ; i++){
				var char = lyric.charAt(i);
				if(isFullWidthChar(char)){
					totalXLength +=2;
				}else{
					totalXLength +=1;
				}
			}

			return totalXLength;
		}
		

		for(var i = 0; i < songLength ; i++){
			lineLength = (songModel[i] == null ) ? 0 : songModel[i].length;
			line = songModel[i];
			lineOutput = [];
			if(line !== null){
				chordPositionY = i;
				chordPositionX = 0;
				for(var j = 0; j < lineLength ; j++){					
					bar = line[j];					
					chord = bar.chord;
					lyric = bar.lyric;					
					if(chord != null && chord.chordName != null){
						outputArray.push({"chordName" : chord.chordName , "chordDuration" : chord.chordDuration , "chordLine" : chordPositionY , "chordPosition" : chordPositionX });
					}					
					//chordPositionX += bar.lyric.length;					
					chordPositionX += getChordPosition(lyric);
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
					lyric = lyric.replace(/\s/g , "&nbsp;");
					if(chord == null || chord.chordName == null){
						lineOutput.push("<span class='bar'>" + lyric + "</span>");
					}
					else{						
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

	//handle importsheet 
	o.setObjBySongSheet = function(dataArray){
		var songModel = [];
		var lineArray,
		 	bar,
		 	rawChords,
		 	chords,
		 	chordPositionArray,		 	
		 	chordObj,		 	
		 	lyricString,
		 	lyricPosition;


		for(var i = 0 , length = dataArray.length ; i < length ; i+=2){
			lineArray = [];
			rawChords = dataArray[i];
			lyricString = dataArray[i+1];
			//need to refine rawChords



			chords = rawChords.split(/\s+/gi);			
			chordPositionArray = rawChords.split(/\S+/gi);
			//console.log(chords , chordPositionArray , lyricString);
			//chords array should have format ("    ","F","     ","D#");
			//notice: the last ele of chords array must be a 'chord' instead of empty content.

			//if last chords is empty content remove it.
			if(chords.length > 1 && chords[chords.length-1].length == 0){
				chords.splice(chords.length-1,chords.length);
			}			


			if(chords.length == 1 && chords[0].length == 0){
				//only lyricString				
				bar = { "chord" : null , "lyric" : lyricString }
				lineArray.push(bar);
			}
			else{
				var firstChordObjLength = chordPositionArray[0].length;
				for(var j=0 , chordNum = chords.length ; j < chordNum ; j++){
					if(j == chordPositionArray.length)
						break;

					if(chords[j].length == 0 && chordPositionArray[j].length == 0)
						continue;
					
					if(firstChordObjLength > 0){							
						if(j < chordNum-1)
							lyricPosition = chordPositionArray[j].length;
					}
					else{												
						lyricPosition = chordPositionArray[j+1].length;
						// if name of chord is too long , we prolong the distance between two chord						
						if(lyricPosition < chords[j].length ){							
							lyricPosition += chords[j].length - lyricPosition;
						}
					}


					//process lyric					
					if(lyricPosition > lyricString.length){						
						if(j == chordNum-1){
							lyric = lyricString;
						}
						else{
							if(lyricString.length == 0){
								var empty = new Array(lyricPosition+1);						
								lyric = empty.join(" ");	
							}
							else{
								lyric = lyricString;
								lyricString = "";
							}							
						}
						//console.log("lyricPosition > lyricString.length:" + lyric);
					}
					else{						
						if(j == chordNum-1){
							lyric = lyricString;
						}												
						else{
							//handle full width char							
							var char , realCharNo = 0;							
							for(var k = 0 ; k < lyricPosition ;k++){
								char = lyricString.charAt(k);
								if(isFullWidthChar(char)){									
									realCharNo += 1;
								}
								else{
									realCharNo += 2;	
								}
							}
							realCharNo = Math.floor(realCharNo/2);


							lyric = lyricString.substring(0, realCharNo);
							lyricString = lyricString.substr(realCharNo);
						}
						//console.log("lyricPosition <= lyricString.length:" + lyric);
					}

					//process chord
					if(chords[j].length == 0){
						chordObj = null;
					}
					else{
						chordObj = {"chordName" : chords[j] , "chordDuration" : 1+"" };	
					}					
					bar = { "chord" : chordObj , "lyric" :  lyric}
					lineArray.push(bar);					
				}
			}
			songModel.push(lineArray);			
		}				
		_songModel = songModel;		
		modelIsChange = true;
	}
	
	

	return o;

})( songFormatCompiler || {} );


